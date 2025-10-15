package com.projectlibre.adapter.springdb.repository;

import com.projectlibre.adapter.springdb.entity.SampleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleEntityRepository extends JpaRepository<SampleEntity, Long> {
}
