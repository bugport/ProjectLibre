package com.projectlibre.adapter.springdb.adapter;

import com.projectlibre.adapter.springdb.entity.AssignmentEntity;
import com.projectlibre.adapter.springdb.repository.AssignmentRepository;
import com.projectlibre1.pm.assignment.Assignment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AssignmentStorageAdapter {

    private final AssignmentRepository assignmentRepository;

    public AssignmentStorageAdapter(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<AssignmentEntity> saveAssignments(List<Assignment> assignments) {
        List<AssignmentEntity> mapped = assignments.stream().map(a -> new AssignmentEntity(
                a.getTask().getUniqueId(),
                a.getResource().getUniqueId(),
                a.getUnits(),
                null
        )).collect(Collectors.toList());
        return assignmentRepository.saveAll(mapped);
    }
}
