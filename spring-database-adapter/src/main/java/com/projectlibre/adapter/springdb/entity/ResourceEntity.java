package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class ResourceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unique_id", unique = true)
    private Long uniqueId;

    @Column(nullable = false)
    private String name;

    @Column(name = "resource_type")
    private Integer resourceType;

    @Column(name = "email")
    private String email;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "notes", length = 4000)
    private String notes;

    protected ResourceEntity() {}

    public ResourceEntity(Long uniqueId, String name, Integer resourceType, String email, String groupName, String notes) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.resourceType = resourceType;
        this.email = email;
        this.groupName = groupName;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public Long getUniqueId() { return uniqueId; }
    public void setUniqueId(Long uniqueId) { this.uniqueId = uniqueId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getResourceType() { return resourceType; }
    public void setResourceType(Integer resourceType) { this.resourceType = resourceType; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
