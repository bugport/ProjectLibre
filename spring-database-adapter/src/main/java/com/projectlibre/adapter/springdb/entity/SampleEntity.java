package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sample_records")
public class SampleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    protected SampleEntity() {
    }

    public SampleEntity(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
