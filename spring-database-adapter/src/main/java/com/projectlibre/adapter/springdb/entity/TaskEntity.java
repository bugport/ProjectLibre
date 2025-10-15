package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unique_id", unique = true)
    private Long uniqueId;

    @Column(nullable = false)
    private String name;

    @Column(name = "project_unique_id", nullable = false)
    private Long projectUniqueId;

    @Column(name = "parent_unique_id")
    private Long parentUniqueId;

    @Column(name = "start_ms")
    private Long startMs;

    @Column(name = "end_ms")
    private Long endMs;

    @Column(name = "notes", length = 4000)
    private String notes;

    protected TaskEntity() {}

    public TaskEntity(Long uniqueId, String name, Long projectUniqueId, Long startMs, Long endMs, String notes, Long parentUniqueId) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.projectUniqueId = projectUniqueId;
        this.startMs = startMs;
        this.endMs = endMs;
        this.notes = notes;
        this.parentUniqueId = parentUniqueId;
    }

    public Long getId() { return id; }
    public Long getUniqueId() { return uniqueId; }
    public void setUniqueId(Long uniqueId) { this.uniqueId = uniqueId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getProjectUniqueId() { return projectUniqueId; }
    public void setProjectUniqueId(Long projectUniqueId) { this.projectUniqueId = projectUniqueId; }
    public Long getStartMs() { return startMs; }
    public void setStartMs(Long startMs) { this.startMs = startMs; }
    public Long getEndMs() { return endMs; }
    public void setEndMs(Long endMs) { this.endMs = endMs; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getParentUniqueId() { return parentUniqueId; }
    public void setParentUniqueId(Long parentUniqueId) { this.parentUniqueId = parentUniqueId; }
}
