# Delivery application

### Tech stack:

- Nest.js - main app (fintech part)
- Fastify - Integration layer, workers, schemas
- Golang - client db application (new-exchange)
- Jest/Vitests - unit/integration tests
- PostgreSQL - main db
- Typeorm - orm
- Avro - schemas managment
- Nats - message broker
- Apollo federation - gateway
- Redis - cache db
- Docker - it's just docker....you know what i am saying

### Architecture:

- `exchange` - service for client data (randomly generated data)
- `new-exchange` - same shit, just written in golang
- `integration-layer` - service for reading exchange db, validate and send to microservices
- `fido` - delivery service (fintech part)

### Note:

This project use schema-registry package from *https://github.com/OlegStrokan/schema-registry* for golang and *https://www.npmjs.com/package/@stroka01/schema-registry* for typescript. I will update this misunderstandings later

## To be continued...
