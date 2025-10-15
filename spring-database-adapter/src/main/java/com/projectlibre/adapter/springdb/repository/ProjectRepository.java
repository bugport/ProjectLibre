package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    Optional<ProjectEntity> findByUniqueId(Long uniqueId);
}
