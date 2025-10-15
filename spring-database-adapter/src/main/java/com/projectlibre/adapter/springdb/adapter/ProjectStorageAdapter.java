package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.ProjectEntity;
import com.projectlibre.adapter.springdb.entity.TaskEntity;
import com.projectlibre.adapter.springdb.entity.AssignmentEntity;
import com.projectlibre.adapter.springdb.entity.DependencyEntity;
import com.projectlibre.adapter.springdb.repository.ProjectRepository;
import com.projectlibre.adapter.springdb.repository.TaskRepository;
import com.projectlibre.adapter.springdb.repository.AssignmentRepository;
import com.projectlibre.adapter.springdb.repository.DependencyRepository;
import com.projectlibre1.pm.task.Project;
import com.projectlibre1.pm.task.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProjectStorageAdapter {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AssignmentRepository assignmentRepository;
    private final DependencyRepository dependencyRepository;

    public ProjectStorageAdapter(ProjectRepository projectRepository, TaskRepository taskRepository,
                                 AssignmentRepository assignmentRepository, DependencyRepository dependencyRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.assignmentRepository = assignmentRepository;
        this.dependencyRepository = dependencyRepository;
    }

    public ProjectEntity saveProject(Project project) {
        ProjectEntity entity = new ProjectEntity(project.getUniqueId(), project.getName(), project.getNotes());
        ProjectEntity persisted = projectRepository.save(entity);
        // Persist tasks
        @SuppressWarnings("unchecked")
        List<Task> tasks = (List<Task>) project.getTasks();
        List<TaskEntity> mapped = tasks.stream().map(t -> new TaskEntity(
                t.getUniqueId(),
                t.getName(),
                project.getUniqueId(),
                t.getCurrentSchedule().getStart(),
                t.getCurrentSchedule().getFinish(),
                t.getNotes(),
                t.getWbsParentTask() != null ? t.getWbsParentTask().getUniqueId() : null
        )).collect(Collectors.toList());
        taskRepository.saveAll(mapped);

        // Persist assignments
        List<Assignment> allAssignments = tasks.stream()
                .flatMap(t -> {
                    java.util.List<Assignment> list = new java.util.ArrayList<>();
                    try {
                        java.util.Iterator it = t.getAssignments().iterator();
                        while (it.hasNext()) {
                            Object o = it.next();
                            if (o instanceof Assignment a) list.add(a);
                        }
                    } catch (Exception ignored) {}
                    return list.stream();
                })
                .collect(Collectors.toList());
        List<AssignmentEntity> mappedAssignments = allAssignments.stream().map(a -> new AssignmentEntity(
                a.getTask().getUniqueId(),
                a.getResource().getUniqueId(),
                a.getUnits(),
                null
        )).collect(Collectors.toList());
        assignmentRepository.saveAll(mappedAssignments);

        // Persist dependencies
        List<DependencyEntity> mappedDeps = tasks.stream()
                .flatMap(t -> {
                    java.util.List<DependencyEntity> list = new java.util.ArrayList<>();
                    try {
                        java.util.Iterator it = t.getSuccessorList().iterator();
                        while (it.hasNext()) {
                            Object obj = it.next();
                            if (obj instanceof com.projectlibre1.pm.dependency.Dependency dep) {
                                list.add(new DependencyEntity(
                                        ((com.projectlibre1.pm.task.Task) dep.getPredecessor()).getUniqueId(),
                                        ((com.projectlibre1.pm.task.Task) dep.getSuccessor()).getUniqueId(),
                                        dep.getDependencyType(),
                                        dep.getLag()
                                ));
                            }
                        }
                    } catch (Exception ignored) {}
                    return list.stream();
                })
                .collect(Collectors.toList());
        dependencyRepository.saveAll(mappedDeps);
        return persisted;
    }

    public Optional<ProjectEntity> findProjectByUniqueId(long uniqueId) {
        return projectRepository.findByUniqueId(uniqueId);
    }

    public List<TaskEntity> findTasksByProjectUniqueId(long uniqueId) {
        return taskRepository.findByProjectUniqueId(uniqueId);
    }
}
