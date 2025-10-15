#!/usr/bin/env bash
set -euo pipefail

# Portable database setup script using Docker
# Supports: postgres, mysql
# Actions: up, down, status, print-config

SCRIPT_NAME=$(basename "$0")
DB_ENGINE=${DB_ENGINE:-postgres}
DB_NAME=${DB_NAME:-projectlibre}
DB_USER=${DB_USER:-projectlibre}
DB_PASSWORD=${DB_PASSWORD:-secret}
DB_PORT=${DB_PORT:-}

POSTGRES_IMAGE=${POSTGRES_IMAGE:-postgres:16-alpine}
MYSQL_IMAGE=${MYSQL_IMAGE:-mysql:8.4}

POSTGRES_PORT_DEFAULT=5432
MYSQL_PORT_DEFAULT=3306

POSTGRES_CONTAINER_NAME=${POSTGRES_CONTAINER_NAME:-projectlibre-postgres}
MYSQL_CONTAINER_NAME=${MYSQL_CONTAINER_NAME:-projectlibre-mysql}

print_usage() {
  cat <<EOF
${SCRIPT_NAME} - Start/stop a local database in Docker and print configs.

USAGE:
  ${SCRIPT_NAME} [--engine postgres|mysql] [--name <db>] [--user <user>] [--password <pass>] [--port <port>] <action>

ACTIONS:
  up            Start the selected database in Docker (idempotent)
  down          Stop and remove the database container
  status        Show container status and connection string
  print-config  Print Spring application.yml snippet and JDBC URL

ENV VARS (override defaults):
  DB_ENGINE=postgres|mysql   (default: postgres)
  DB_NAME=projectlibre       (database name)
  DB_USER=projectlibre       (username)
  DB_PASSWORD=secret         (password)
  DB_PORT=<port>             (host port to expose)
  POSTGRES_IMAGE=postgres:16-alpine
  MYSQL_IMAGE=mysql:8.4

EXAMPLES:
  ${SCRIPT_NAME} up
  DB_ENGINE=mysql DB_PASSWORD=mysecret ${SCRIPT_NAME} up
  ${SCRIPT_NAME} --engine postgres --port 6543 status
  ${SCRIPT_NAME} print-config
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

parse_args() {
  ACTION=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      up|down|status|print-config)
        ACTION="$1"; shift ;;
      -e|--engine)
        DB_ENGINE="$2"; shift 2 ;;
      -n|--name)
        DB_NAME="$2"; shift 2 ;;
      -u|--user)
        DB_USER="$2"; shift 2 ;;
      -p|--password)
        DB_PASSWORD="$2"; shift 2 ;;
      -P|--port)
        DB_PORT="$2"; shift 2 ;;
      -h|--help)
        print_usage; exit 0 ;;
      *)
        echo "Unknown argument: $1" >&2; print_usage; exit 1 ;;
    esac
  done
  if [[ -z "${ACTION}" ]]; then
    echo "Error: action is required" >&2
    print_usage
    exit 1
  fi
}

container_name() {
  case "$DB_ENGINE" in
    postgres) echo "$POSTGRES_CONTAINER_NAME" ;;
    mysql) echo "$MYSQL_CONTAINER_NAME" ;;
    *) echo "Unsupported DB_ENGINE: $DB_ENGINE" >&2; exit 1 ;;
  esac
}

resolve_port() {
  if [[ -n "${DB_PORT}" ]]; then echo "$DB_PORT"; return; fi
  case "$DB_ENGINE" in
    postgres) echo "$POSTGRES_PORT_DEFAULT" ;;
    mysql) echo "$MYSQL_PORT_DEFAULT" ;;
  esac
}

jdbc_url() {
  local port; port=$(resolve_port)
  case "$DB_ENGINE" in
    postgres)
      echo "jdbc:postgresql://localhost:${port}/${DB_NAME}" ;;
    mysql)
      echo "jdbc:mysql://localhost:${port}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" ;;
  esac
}

print_spring_yaml() {
  local url; url=$(jdbc_url)
  case "$DB_ENGINE" in
    postgres)
      cat <<YAML
spring:
  datasource:
    url: ${url}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
YAML
      ;;
    mysql)
      cat <<YAML
spring:
  datasource:
    url: ${url}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
YAML
      ;;
  esac
}

print_connection_info() {
  local port; port=$(resolve_port)
  case "$DB_ENGINE" in
    postgres)
      echo "Database: Postgres"
      echo "Container: $(container_name)"
      echo "Host: localhost"
      echo "Port: ${port}"
      echo "User: ${DB_USER}"
      echo "Password: ${DB_PASSWORD}"
      echo "DB Name: ${DB_NAME}"
      echo "JDBC: $(jdbc_url)"
      echo "psql: PGPASSWORD=\"${DB_PASSWORD}\" psql -h localhost -p ${port} -U ${DB_USER} -d ${DB_NAME}" ;;
    mysql)
      echo "Database: MySQL"
      echo "Container: $(container_name)"
      echo "Host: localhost"
      echo "Port: ${port}"
      echo "User: ${DB_USER}"
      echo "Password: ${DB_PASSWORD}"
      echo "DB Name: ${DB_NAME}"
      echo "JDBC: $(jdbc_url)"
      echo "mysql: mysql -h localhost -P ${port} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}" ;;
  esac
}

container_running() {
  docker ps --filter "name=$(container_name)" --format '{{.Names}}' | grep -q "$(container_name)" || return 1
}

container_exists() {
  docker ps -a --filter "name=$(container_name)" --format '{{.Names}}' | grep -q "$(container_name)" || return 1
}

action_up() {
  require_cmd docker
  local port; port=$(resolve_port)
  if container_running; then
    echo "Container $(container_name) already running"
    print_connection_info
    return 0
  fi
  if container_exists; then
    echo "Starting existing container $(container_name)" 
    docker start "$(container_name)" >/dev/null
    print_connection_info
    return 0
  fi
  case "$DB_ENGINE" in
    postgres)
      docker run -d \
        --name "$(container_name)" \
        -e POSTGRES_DB="${DB_NAME}" \
        -e POSTGRES_USER="${DB_USER}" \
        -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
        -p "${port}:5432" \
        "${POSTGRES_IMAGE}" >/dev/null
      ;;
    mysql)
      docker run -d \
        --name "$(container_name)" \
        -e MYSQL_DATABASE="${DB_NAME}" \
        -e MYSQL_USER="${DB_USER}" \
        -e MYSQL_PASSWORD="${DB_PASSWORD}" \
        -e MYSQL_ROOT_PASSWORD="${DB_PASSWORD}" \
        -p "${port}:3306" \
        "${MYSQL_IMAGE}" >/dev/null
      ;;
    *)
      echo "Unsupported DB_ENGINE: $DB_ENGINE" >&2; exit 1 ;;
  esac
  echo "Started container $(container_name)"
  print_connection_info
}

action_down() {
  require_cmd docker
  if container_exists; then
    docker rm -f "$(container_name)" >/dev/null || true
    echo "Removed container $(container_name)"
  else
    echo "Container $(container_name) not found"
  fi
}

action_status() {
  require_cmd docker
  if container_running; then
    echo "RUNNING: $(container_name)"
  elif container_exists; then
    echo "STOPPED: $(container_name)"
  else
    echo "MISSING: $(container_name)"
  fi
  print_connection_info
}

action_print_config() {
  echo "# JDBC URL" 
  echo "$(jdbc_url)"
  echo
  echo "# Spring application.yml snippet (override in spring-database-adapter/src/main/resources/application.yml)"
  print_spring_yaml
}

main() {
  if [[ $# -eq 0 ]]; then
    print_usage; exit 1
  fi
  parse_args "$@"
  case "$ACTION" in
    up) action_up ;;
    down) action_down ;;
    status) action_status ;;
    print-config) action_print_config ;;
    *) echo "Unknown action: ${ACTION}" >&2; exit 1 ;;
  esac
}

main "$@"
