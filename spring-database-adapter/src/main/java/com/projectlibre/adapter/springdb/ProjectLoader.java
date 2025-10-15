package com.projectlibre.adapter.springdb;

import com.projectlibre.adapter.springdb.adapter.DomainRehydrator;
import com.projectlibre1.pm.task.Project;

import java.util.Optional;

public final class ProjectLoader {
    private ProjectLoader() {}

    public static Optional<Project> tryLoad(long projectUniqueId) {
        DomainRehydrator rehydrator = SpringPersistence.getBean(DomainRehydrator.class);
        return rehydrator.loadProject(projectUniqueId);
    }

    public static Project load(long projectUniqueId) {
        return tryLoad(projectUniqueId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectUniqueId));
    }
}
