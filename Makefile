# Define the commands as variables for reusability and readability
DOCKER_COMPOSE_UP = docker compose up -d
GO_RUN = go run main.go
YARN_MIGRATION_RUN = yarn migration:run
YARN_START_DEV = yarn start:dev
YARN_DEV = yarn dev
DOCKER_COMPOSE_DOWN = docker compose down

# Define the ports for each service
NEW_EXCHANGE_PORT = 8080  # Replace with the actual port used by new-exchange
NEW_FIDO_PORT = 3000      # Replace with the actual port used by new-fido
INTEGRATION_LAYER_PORT = 5000  # Replace with the actual port used by integration-layer

# Root directory
ROOT_DIR := $(shell pwd)

# Targets
.PHONY: all docker-up new-exchange new-fido integration-layer stop-services

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

stop-services:
	@echo "Stopping all services..."
	@for port in $(NEW_EXCHANGE_PORT) $(NEW_FIDO_PORT) $(INTEGRATION_LAYER_PORT); do \
		echo "Checking port $$port..."; \
		pid=$$(lsof -t -i :$$port); \
		if [ -n "$$pid" ]; then \
			echo "Killing PID $$pid on port $$port"; \
			kill -9 $$pid; \
		else \
			echo "No process found on port $$port"; \
		fi; \
	done
	@echo "Stopping Docker containers..."
	$(DOCKER_COMPOSE_DOWN)
