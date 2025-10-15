package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<ResourceEntity, Long> {
    Optional<ResourceEntity> findByUniqueId(Long uniqueId);
}
