package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.*;
import com.projectlibre.adapter.springdb.repository.*;
import com.projectlibre1.pm.task.Project;
import com.projectlibre1.pm.task.ProjectFactory;
import com.projectlibre1.pm.task.NormalTask;
import com.projectlibre1.pm.task.Task;
import com.projectlibre1.pm.dependency.Dependency;
import com.projectlibre1.pm.resource.Resource;
import com.projectlibre1.pm.resource.ResourceImpl;
import com.projectlibre1.pm.resource.ResourcePool;
import com.projectlibre1.pm.resource.ResourcePoolFactory;
import com.projectlibre1.undo.DataFactoryUndoController;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class DomainRehydrator {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ResourceRepository resourceRepository;
    private final AssignmentRepository assignmentRepository;
    private final DependencyRepository dependencyRepository;

    public DomainRehydrator(ProjectRepository projectRepository,
                            TaskRepository taskRepository,
                            ResourceRepository resourceRepository,
                            AssignmentRepository assignmentRepository,
                            DependencyRepository dependencyRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.resourceRepository = resourceRepository;
        this.assignmentRepository = assignmentRepository;
        this.dependencyRepository = dependencyRepository;
    }

    public Optional<Project> loadProject(long projectUniqueId) {
        Optional<ProjectEntity> projectOpt = projectRepository.findByUniqueId(projectUniqueId);
        if (projectOpt.isEmpty()) return Optional.empty();

        // Create a new Project with default resource pool
        DataFactoryUndoController undo = new DataFactoryUndoController();
        ResourcePool pool = ResourcePoolFactory.getInstance().createResourcePool("Loaded", undo);
        pool.setLocal(true);
        Project project = Project.createProject(pool, undo);
        project.setLocal(true);
        project.setName(projectOpt.get().getName());
        project.setUniqueId(projectUniqueId);
        project.setNotes(projectOpt.get().getNotes());
        project.setInitialized(true);

        // Resources
        List<ResourceEntity> resources = resourceRepository.findAll();
        Map<Long, Resource> uniqueIdToResource = new HashMap<>();
        for (ResourceEntity re : resources) {
            Resource r = pool.newResourceInstance();
            r.setUniqueId(re.getUniqueId());
            r.setName(re.getName());
            try { r.setGroup(re.getGroupName()); } catch (Exception ignored) {}
            try { r.setNotes(re.getNotes()); } catch (Exception ignored) {}
            uniqueIdToResource.put(re.getUniqueId(), r);
        }

        // Tasks
        List<TaskEntity> taskEntities = taskRepository.findByProjectUniqueId(projectUniqueId);
        Map<Long, NormalTask> uniqueIdToTask = new HashMap<>();
        // Create all tasks first
        for (TaskEntity te : taskEntities) {
            NormalTask t = new NormalTask(project);
            t.setName(te.getName());
            t.setUniqueId(te.getUniqueId());
            t.getCurrentSchedule().setStart(te.getStartMs() == null ? 0L : te.getStartMs());
            t.getCurrentSchedule().setFinish(te.getEndMs() == null ? 0L : te.getEndMs());
            t.setNotes(te.getNotes());
            uniqueIdToTask.put(te.getUniqueId(), t);
        }
        // Wire WBS hierarchy and add to project's model
        for (TaskEntity te : taskEntities) {
            NormalTask t = uniqueIdToTask.get(te.getUniqueId());
            if (te.getParentUniqueId() != null) {
                Task parent = uniqueIdToTask.get(te.getParentUniqueId());
                t.setWbsParent((NormalTask) parent);
            }
            t.connectToProject();
        }

        // Assignments
        List<AssignmentEntity> assigns = assignmentRepository.findAll();
        for (AssignmentEntity ae : assigns) {
            NormalTask t = uniqueIdToTask.get(ae.getTaskUniqueId());
            Resource r = uniqueIdToResource.get(ae.getResourceUniqueId());
            if (t != null && r != null) {
                com.projectlibre1.pm.assignment.Assignment a = com.projectlibre1.pm.assignment.Assignment.getInstance(t, r, ae.getUnits() == null ? 1.0 : ae.getUnits(), 0);
                t.getAssignments().add(a);
            }
        }

        // Dependencies
        List<DependencyEntity> deps = dependencyRepository.findAll();
        for (DependencyEntity de : deps) {
            Task pred = uniqueIdToTask.get(de.getPredecessorUniqueId());
            Task succ = uniqueIdToTask.get(de.getSuccessorUniqueId());
            if (pred != null && succ != null) {
                com.projectlibre1.pm.dependency.Dependency d = com.projectlibre1.pm.dependency.Dependency.getInstance((com.projectlibre1.pm.dependency.HasDependencies) pred, (com.projectlibre1.pm.dependency.HasDependencies) succ, de.getType() == null ? 0 : de.getType(), de.getLag() == null ? 0L : de.getLag());
                d.updateDependencyLists();
            }
        }

        return Optional.of(project);
    }
}
