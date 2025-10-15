# Persistence Adapter (Spring Data JPA)

This project includes a Gradle submodule `spring-database-adapter` that adds database persistence for key ProjectLibre domain objects via Spring Data JPA. By default it uses an in-memory H2 database; you can switch to Postgres/MySQL by changing `application.yml`.

## Mapped entities

The adapter maps a subset of domain state into relational tables:

- Project (`projects`)
  - `id` (PK, surrogate), `unique_id` (domain), `name`, `notes`
- Task (`tasks`)
  - `id`, `unique_id`, `project_unique_id`, `parent_unique_id`, `name`, `start_ms`, `end_ms`, `notes`
- Resource (`resources`)
  - `id`, `unique_id`, `name`, `resource_type`, `email`, `group_name`, `notes`
- Assignment (`assignments`)
  - `id`, `task_unique_id`, `resource_unique_id`, `units`, `cost`
- Dependency (`dependencies`)
  - `id`, `predecessor_unique_id`, `successor_unique_id`, `type`, `lag`

Notes:
- We use ProjectLibre "uniqueId" as the stable cross-table reference.
- Additional ProjectLibre fields exist in memory but are not yet persisted. Extend entities if needed.

## Modules and classes

- Configuration
  - `com.projectlibre.adapter.springdb.config.JpaConfig`: `@EntityScan`/`@EnableJpaRepositories`, transaction management
  - `src/main/resources/application.yml`: H2 in-memory defaults
  - Change `spring.datasource.url` to point to your DB
- Entities
  - `ProjectEntity`, `TaskEntity`, `ResourceEntity`, `AssignmentEntity`, `DependencyEntity`
- Repositories
  - `ProjectRepository`, `TaskRepository`, `ResourceRepository`, `AssignmentRepository`, `DependencyRepository`
- Adapters (save/query)
  - `ProjectStorageAdapter`: persist a `com.projectlibre1.pm.task.Project` with tasks, assignments, dependencies
  - `ResourceStorageAdapter`: persist `com.projectlibre1.pm.resource.Resource`
  - `AssignmentStorageAdapter`: persist a list of `com.projectlibre1.pm.assignment.Assignment`
- Rehydration (load into domain objects)
  - `DomainRehydrator.loadProject(uniqueId)`: rebuilds a Project with tasks (WBS), resources, assignments, dependencies
  - `ProjectLoader`: convenience to boot Spring and return a hydrated Project
  - `SpringPersistence`: boots a minimal non-web Spring context

## Quick start

- Build core via Ant (Gradle task wires this automatically):
```bash
./gradlew :antCompile
```
- Build the adapter:
```bash
./gradlew :spring-database-adapter:build
```

## Saving a project

```java
import com.projectlibre.adapter.springdb.SpringPersistence;
import com.projectlibre.adapter.springdb.adapter.ProjectStorageAdapter;

var ctx = SpringPersistence.startIfNeeded();
var saver = ctx.getBean(ProjectStorageAdapter.class);
saver.saveProject(project); // project is com.projectlibre1.pm.task.Project
```

## Loading a project (rehydration)

```java
import com.projectlibre.adapter.springdb.ProjectLoader;
import com.projectlibre1.pm.task.Project;

Project p = ProjectLoader.load(123L); // throws if not found
// or
var opt = ProjectLoader.tryLoad(123L);
```

## Switch to Postgres

```yaml
# spring-database-adapter/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/projectlibre
    username: projectlibre
    password: secret
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
```
Add dependency in `spring-database-adapter/build.gradle.kts`:
```kts
runtimeOnly("org.postgresql:postgresql:42.7.4")
```

## Design notes

- The adapter does not modify core classes; it maps a pragmatic subset of fields.
- WBS hierarchy is represented by `parent_unique_id` for tasks.
- Associations use domain `uniqueId` to avoid foreign-key churn when rows are re-inserted.
- `DomainRehydrator` uses `ResourcePoolFactory` to create a pool and attaches tasks to the project via `connectToProject()`.

## Extending mappings

- Add columns to the JPA entities and database schema
- Populate from domain in `ProjectStorageAdapter` (save path)
- Hydrate back in `DomainRehydrator` (load path)

## Troubleshooting

- Ensure Ant-compiled classes are present: `./gradlew :antCompile`
- If Hibernate DDL fails, check DB privileges and naming
- For UI integration, call `ProjectLoader.load(...)` and then open the returned Project in the existing UI workflow
