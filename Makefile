.PHONY: build up start-web start-all stop-all

build:
	docker compose build

up:
	docker compose up -d

start-web:
	cd webapp && npm run dev-server

start-all: up start-web

stop-all:
	docker compose down
