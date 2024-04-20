import { ConnectionOptions } from 'typeorm';

const dbConfig: ConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'your_username',
    password: 'your_password',
    database: 'your_database',
    synchronize: true,
    logging: true,
    entities: [
        // Add your entity classes here
    ],
    migrations: [
        // Add your migration classes here
    ],
    subscribers: [
        // Add your subscriber classes here
    ],
};

export default dbConfig;