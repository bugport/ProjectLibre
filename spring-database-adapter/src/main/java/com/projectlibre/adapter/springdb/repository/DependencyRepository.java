package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.DependencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DependencyRepository extends JpaRepository<DependencyEntity, Long> {
    List<DependencyEntity> findByPredecessorUniqueId(Long predecessorUniqueId);
    List<DependencyEntity> findBySuccessorUniqueId(Long successorUniqueId);
}
