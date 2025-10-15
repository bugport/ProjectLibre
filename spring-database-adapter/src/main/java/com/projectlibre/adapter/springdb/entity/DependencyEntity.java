package com.projectlibre.adapter.springdb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dependencies")
public class DependencyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "predecessor_unique_id", nullable = false)
    private Long predecessorUniqueId;

    @Column(name = "successor_unique_id", nullable = false)
    private Long successorUniqueId;

    @Column(name = "type")
    private Integer type;

    @Column(name = "lag")
    private Long lag;

    protected DependencyEntity() {}

    public DependencyEntity(Long predecessorUniqueId, Long successorUniqueId, Integer type, Long lag) {
        this.predecessorUniqueId = predecessorUniqueId;
        this.successorUniqueId = successorUniqueId;
        this.type = type;
        this.lag = lag;
    }

    public Long getId() { return id; }
    public Long getPredecessorUniqueId() { return predecessorUniqueId; }
    public void setPredecessorUniqueId(Long predecessorUniqueId) { this.predecessorUniqueId = predecessorUniqueId; }
    public Long getSuccessorUniqueId() { return successorUniqueId; }
    public void setSuccessorUniqueId(Long successorUniqueId) { this.successorUniqueId = successorUniqueId; }
    public Integer getType() { return type; }
    public void setType(Integer type) { this.type = type; }
    public Long getLag() { return lag; }
    public void setLag(Long lag) { this.lag = lag; }
}
