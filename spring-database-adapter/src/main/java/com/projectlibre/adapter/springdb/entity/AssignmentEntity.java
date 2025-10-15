package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assignments")
public class AssignmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_unique_id", nullable = false)
    private Long taskUniqueId;

    @Column(name = "resource_unique_id", nullable = false)
    private Long resourceUniqueId;

    @Column(name = "units")
    private Double units;

    @Column(name = "cost")
    private Double cost;

    protected AssignmentEntity() {}

    public AssignmentEntity(Long taskUniqueId, Long resourceUniqueId, Double units, Double cost) {
        this.taskUniqueId = taskUniqueId;
        this.resourceUniqueId = resourceUniqueId;
        this.units = units;
        this.cost = cost;
    }

    public Long getId() { return id; }
    public Long getTaskUniqueId() { return taskUniqueId; }
    public void setTaskUniqueId(Long taskUniqueId) { this.taskUniqueId = taskUniqueId; }
    public Long getResourceUniqueId() { return resourceUniqueId; }
    public void setResourceUniqueId(Long resourceUniqueId) { this.resourceUniqueId = resourceUniqueId; }
    public Double getUnits() { return units; }
    public void setUnits(Double units) { this.units = units; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
}
