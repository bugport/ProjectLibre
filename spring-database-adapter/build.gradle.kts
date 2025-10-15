plugins {
    id("java-library")
    id("io.spring.dependency-management") version "1.1.6"
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-dependencies:3.3.4")
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    // Compile against ProjectLibre classes compiled by Ant
    implementation(files("${'$'}{rootProject.projectDir}/projectlibre_build/build"))
}

tasks.test {
    useJUnitPlatform()
}

// Ensure ProjectLibre classes are compiled before compiling this module
tasks.named("compileJava") {
    dependsOn(":antCompile")
}
