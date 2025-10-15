import org.gradle.api.publish.maven.tasks.PublishToMavenRepository
import java.util.Properties

plugins {
    id("maven-publish")
    id("signing")
    id("io.github.gradle-nexus.publish-plugin") version "2.0.0"
    id("org.sonarqube") version "4.4.1.3373"
}

repositories { mavenCentral() }

// Group can be overridden via -PGROUP=... or gradle.properties
group = (findProperty("GROUP") as String?) ?: "org.projectlibre"

// Read version from Ant's build.properties, fallback to SNAPSHOT
val antVersion: String = run {
    val props = Properties()
    val propsFile = file("projectlibre_build/build.properties")
    if (propsFile.exists()) {
        propsFile.inputStream().use(props::load)
        props.getProperty("version", "0.0.0-SNAPSHOT")
    } else {
        "0.0.0-SNAPSHOT"
    }
}
version = antVersion

// Build the fat jar using Ant before publishing
val antFatJar = tasks.register<Exec>("antFatJar") {
    description = "Builds the ProjectLibre fat jar via Ant"
    group = "build"
    workingDir = file("projectlibre_build")
    commandLine = listOf("ant", "fatjar")
}

// Compile classes via Ant for Sonar analysis
val antCompile = tasks.register<Exec>("antCompile") {
    description = "Compiles sources via Ant build.xml"
    group = "build"
    workingDir = file("projectlibre_build")
    commandLine = listOf("ant", "compile")
}

// Ensure all Maven publish tasks build the fat jar first
tasks.withType(PublishToMavenRepository::class).configureEach {
    dependsOn(antFatJar)
}

// Path to the Ant-produced fat jar
val fatJarPath = "projectlibre_build/packages/projectlibre-${'$'}version.jar"

// SonarQube configuration reading paths from Ant build.properties
val antPropsForSonar = Properties().also { props ->
    val propsFile = file("projectlibre_build/build.properties")
    if (propsFile.exists()) propsFile.inputStream().use(props::load)
}

val antDir = file("projectlibre_build")
val srcKeys = listOf("src_core", "src_ui", "src_reports", "src_exchange", "src_contrib")
val sonarSourceDirs: List<String> = srcKeys.mapNotNull { key ->
    antPropsForSonar.getProperty(key)?.takeIf { it.isNotBlank() }
}.map { rel ->
    project.relativePath(antDir.resolve(rel).normalize())
}

// Binaries produced by Ant compile
val sonarBinariesDirs: List<String> = listOf(
    project.relativePath(antDir.resolve("build").normalize()),
    project.relativePath(file("projectlibre_contrib/build").normalize())
)

// Configure SonarQube plugin
sonarqube {
    properties {
        property("sonar.projectName", "ProjectLibre")
        property("sonar.projectKey", (findProperty("sonarProjectKey") as String?) ?: "org.projectlibre:projectlibre")
        property("sonar.projectVersion", project.version.toString())
        property("sonar.sources", sonarSourceDirs.joinToString(","))
        property("sonar.java.binaries", sonarBinariesDirs.joinToString(","))
        property("sonar.java.source", "21")
        property("sonar.java.target", "21")
        property("sonar.sourceEncoding", "UTF-8")

        val hostUrl = providers.gradleProperty("sonarHostUrl").orElse(providers.environmentVariable("SONAR_HOST_URL")).orNull
        if (hostUrl != null) property("sonar.host.url", hostUrl)

        val loginToken = providers.gradleProperty("sonarToken").orElse(providers.environmentVariable("SONAR_TOKEN")).orNull
        if (loginToken != null) property("sonar.login", loginToken)

        val organization = providers.gradleProperty("sonarOrganization").orElse(providers.environmentVariable("SONAR_ORGANIZATION")).orNull
        if (organization != null) property("sonar.organization", organization)
    }
}

// Ensure analysis has compiled classes available
tasks.named("sonarqube") {
    dependsOn(antCompile)
}

// Convenience alias
tasks.register("sonarScan") {
    description = "Runs SonarQube analysis (alias to sonarqube)"
    group = "verification"
    dependsOn("sonarqube")
}

publishing {
    publications {
        create<MavenPublication>("projectlibre") {
            groupId = project.group.toString()
            artifactId = "projectlibre"
            version = project.version.toString()

            artifact(file(fatJarPath)) {
                builtBy(antFatJar)
            }

            pom {
                name.set("ProjectLibre")
                description.set("Open source project management software")
                url.set("https://www.projectlibre.com")
                licenses {
                    license {
                        name.set("Common Public Attribution License 1.0")
                        url.set("https://www.projectlibre.com/license")
                        distribution.set("repo")
                    }
                }
                developers {
                    developer {
                        id.set("projectlibre")
                        name.set("ProjectLibre, Inc.")
                        url.set("https://www.projectlibre.com")
                    }
                }
                scm {
                    url.set("https://github.com/projectlibre/projectlibre")
                    connection.set("scm:git:git://github.com/projectlibre/projectlibre.git")
                    developerConnection.set("scm:git:ssh://github.com:projectlibre/projectlibre.git")
                }
            }
        }
    }
}

// Configure Sonatype (s01) via Nexus Publish Plugin
nexusPublishing {
    repositories {
        sonatype {
            // Use s01 host (most newer OSSRH accounts)
            nexusUrl.set(uri("https://s01.oss.sonatype.org/service/local/"))
            snapshotRepositoryUrl.set(uri("https://s01.oss.sonatype.org/content/repositories/snapshots/"))
            username.set(providers.gradleProperty("ossrhUsername").orElse(providers.environmentVariable("OSSRH_USERNAME")))
            password.set(providers.gradleProperty("ossrhPassword").orElse(providers.environmentVariable("OSSRH_PASSWORD")))
        }
    }
}

// Optional PGP signing (required for releases to Central)
signing {
    val key = providers.gradleProperty("signingKey").orElse(providers.environmentVariable("SIGNING_KEY"))
    val pass = providers.gradleProperty("signingPassword").orElse(providers.environmentVariable("SIGNING_PASSWORD"))
    if (key.isPresent) {
        useInMemoryPgpKeys(key.get(), pass.orNull)
        sign(publishing.publications)
    }
}

// Convenience task: publish and then close+release staging repo
tasks.register("publishToNexus") {
    description = "Publish to Sonatype and close+release the staging repository"
    group = "publishing"
    dependsOn("publishToSonatype", "closeAndReleaseSonatypeStagingRepository")
}
