DOCKER_COMPOSE_UP = docker compose up -d
GO_RUN = go run main.go
YARN_MIGRATION_RUN = yarn migration:run
YARN_START_DEV = yarn start:dev
YARN_DEV = yarn dev

ROOT_DIR := $(shell pwd)

.PHONY: all docker-up new-exchange new-fido integration-layer

all: docker-up new-exchange new-fido integration-layer

docker-up:
	@echo "Starting Docker containers..."
	$(DOCKER_COMPOSE_UP)

new-exchange:
	@echo "Running new-exchange service..."
	cd $(ROOT_DIR)/new-exchange && nohup $(GO_RUN) &

new-fido:
	@echo "Running new-fido migrations and service..."
	cd $(ROOT_DIR)/new-fido && $(YARN_MIGRATION_RUN) && nohup $(YARN_START_DEV) &

integration-layer:
	@echo "Running integration-layer migrations and service..."
	cd $(ROOT_DIR)/integration-layer && $(YARN_MIGRATION_RUN) && nohup $(YARN_DEV) &
