package com.projectlibre.adapter.springdb.port;

import java.util.List;
import java.util.Optional;

public interface StoragePort<T, ID> {
    T save(T entity);
    List<T> findAll();
    Optional<T> findById(ID id);
    void deleteById(ID id);
}
