# Delivery application

### Tech stack:

- Nest.js - main app (fintech part)
- Fastify - Integration layer, workers, schemas
- PostgreSQL - main db
- Typeorm - orm
- Avro - schemas managment
- Nats - message broker
- Apollo federation - gateway
- Redis - cache db
- Docker - it's just docker....you know what i am saying

### Architecture:

- `exchange` - service for client data (randomly generated data)
- `integration-layer` - service for reading exchange db, validate and send to microservices
- `fido` - delivery service (fintech part)
- `common` - shared code between services (currently include avro schema registry)

## To be continued...
