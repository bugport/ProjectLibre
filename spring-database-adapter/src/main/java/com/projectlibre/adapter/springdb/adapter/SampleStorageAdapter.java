package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.SampleEntity;
import com.projectlibre.adapter.springdb.port.StoragePort;
import com.projectlibre.adapter.springdb.repository.SampleEntityRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SampleStorageAdapter implements StoragePort<SampleEntity, Long> {

    private final SampleEntityRepository repository;

    public SampleStorageAdapter(SampleEntityRepository repository) {
        this.repository = repository;
    }

    @Override
    public SampleEntity save(SampleEntity entity) {
        return repository.save(entity);
    }

    @Override
    public List<SampleEntity> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<SampleEntity> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
