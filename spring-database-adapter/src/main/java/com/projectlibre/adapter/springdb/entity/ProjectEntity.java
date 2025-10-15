package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "unique_id", unique = true)
    private Long uniqueId;

    @Column(name = "notes", length = 4000)
    private String notes;

    protected ProjectEntity() {}

    public ProjectEntity(Long uniqueId, String name, String notes) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public Long getUniqueId() { return uniqueId; }
    public void setUniqueId(Long uniqueId) { this.uniqueId = uniqueId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
