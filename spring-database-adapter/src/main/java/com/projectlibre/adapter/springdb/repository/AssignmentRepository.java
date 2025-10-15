package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {
    List<AssignmentEntity> findByTaskUniqueId(Long taskUniqueId);
    List<AssignmentEntity> findByResourceUniqueId(Long resourceUniqueId);
}
