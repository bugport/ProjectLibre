package com.projectlibre.adapter.springdb;

import com.projectlibre.adapter.springdb.config.JpaConfig;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

public final class SpringPersistence {
    private static ConfigurableApplicationContext context;

    private SpringPersistence() {}

    public static synchronized ApplicationContext startIfNeeded() {
        if (context == null) {
            context = new SpringApplicationBuilder(JpaConfig.class)
                    .properties("spring.main.web-application-type=none")
                    .run();
        }
        return context;
    }

    public static synchronized void stop() {
        if (context != null) {
            context.close();
            context = null;
        }
    }

    public static <T> T getBean(Class<T> type) {
        return (T) startIfNeeded().getBean(type);
    }
}
