package com.projectlibre.adapter.springdb.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableAutoConfiguration
@EnableTransactionManagement
@EntityScan(basePackages = "com.projectlibre.adapter.springdb.entity")
@EnableJpaRepositories(basePackages = "com.projectlibre.adapter.springdb.repository")
public class JpaConfig {
}
