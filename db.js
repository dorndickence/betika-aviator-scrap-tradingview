import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'aviator',
});

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export const releaseClient = (client) => {
  client.release();
};

export const query = (text,params) => pool.query(text,params)