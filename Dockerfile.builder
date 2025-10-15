# Builder image for ProjectLibre (Ant-based) on OpenJDK 21
# Includes tools to build tar/zip, deb, rpm packages

FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 \
    ANT_HOME=/usr/share/ant \
    PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin:$ANT_HOME/bin

# Install OpenJDK 21, Ant and build tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       openjdk-21-jdk \
       ant \
       ca-certificates \
       git \
       zip unzip \
       tar \
       fakeroot \
       rpm \
       dpkg-dev \
       make \
       curl \
    && rm -rf /var/lib/apt/lists/*

# Create build user to avoid root-owned artifacts
RUN useradd -m -u 1000 builder
USER builder
WORKDIR /workspace

# Default command shows Ant version; mount the repo and override in CI
CMD ["bash", "-lc", "java -version && ant -version"]
