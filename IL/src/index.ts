const express = require('express');

import { Client } from 'pg';

const app = express()

const client = new Client({
    host: 'localhost',
    port: 8434,
    user: 'stroka01',
    password: 'user',
    database: 'exchange_db'
});

client.connect()


app.get('/parcels', async (req, res) => {

    const { rows } = await client.query('SELECT * FROM parcel_event');

    res.send(rows);

})



app.listen(9000, '')

process.on('exit', () => {
    client.end();
});
