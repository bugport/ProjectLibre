package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    Optional<TaskEntity> findByUniqueId(Long uniqueId);
    List<TaskEntity> findByProjectUniqueId(Long projectUniqueId);
}
