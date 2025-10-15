package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.ProjectEntity;
import com.projectlibre.adapter.springdb.entity.TaskEntity;
import com.projectlibre.adapter.springdb.repository.ProjectRepository;
import com.projectlibre.adapter.springdb.repository.TaskRepository;
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

    public ProjectStorageAdapter(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
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
                t.getNotes()
        )).collect(Collectors.toList());
        taskRepository.saveAll(mapped);
        return persisted;
    }

    public Optional<ProjectEntity> findProjectByUniqueId(long uniqueId) {
        return projectRepository.findByUniqueId(uniqueId);
    }

    public List<TaskEntity> findTasksByProjectUniqueId(long uniqueId) {
        return taskRepository.findByProjectUniqueId(uniqueId);
    }
}
