# Build ProjectLibre with OpenJDK 21 using Ant
# Produces artifacts under projectlibre_build/dist

FROM debian:bookworm AS build

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 \
    ANT_HOME=/usr/share/ant \
    PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin:$ANT_HOME/bin

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       openjdk-21-jdk \
       ant \
       ca-certificates \
       zip unzip \
       fakeroot rpm dpkg-dev \
       git curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

# Build
RUN ant -Dbuild_contrib=true -f projectlibre_build/build.xml clean dist

# Runtime image containing built artifacts only
FROM debian:bookworm-slim AS artifacts
WORKDIR /app
COPY --from=build /app/projectlibre_build/dist /app/dist

# Default command prints contents of dist
CMD ["bash", "-lc", "ls -alh /app/dist && echo 'Artifacts ready in /app/dist'"]
