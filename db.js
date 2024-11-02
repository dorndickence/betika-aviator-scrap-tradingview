import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: 'postgres.ueliqlmohqswycazcamy',
  // password: '',
  password: 'Dornai@4449',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
});

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export const releaseClient = (client) => {
  client.release();
};

export const query = (text,params) => pool.query(text,params)