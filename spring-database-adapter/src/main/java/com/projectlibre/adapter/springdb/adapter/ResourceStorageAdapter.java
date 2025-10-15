package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.ResourceEntity;
import com.projectlibre.adapter.springdb.repository.ResourceRepository;
import com.projectlibre1.pm.resource.Resource;
import com.projectlibre1.pm.resource.ResourceImpl;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ResourceStorageAdapter {

    private final ResourceRepository resourceRepository;

    public ResourceStorageAdapter(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public ResourceEntity saveResource(Resource resource) {
        Integer type = null;
        try {
            type = resource.getResourceType();
        } catch (Exception ignored) {}
        String email = null;
        try { email = ((ResourceImpl) resource).getGlobalResource().getEmailAddress(); } catch (Exception ignored) {}
        ResourceEntity entity = new ResourceEntity(
                resource.getUniqueId(),
                resource.getName(),
                type,
                email,
                resource.getGroup(),
                resource.getNotes()
        );
        return resourceRepository.save(entity);
    }

    public Optional<ResourceEntity> findByUniqueId(long uniqueId) {
        return resourceRepository.findByUniqueId(uniqueId);
    }
}
