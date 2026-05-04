const { Pool } = require('pg');

const pool = new Pool({
    user: 'your_postgres_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_postgres_password',
    port: 5432,
});

module.exports = pool;