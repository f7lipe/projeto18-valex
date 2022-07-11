import pg from "pg";
import './setupEnv.ts'

const { Pool } = pg;
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {},
};

if (process.env.MODE === "PROD") {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const connection = new Pool(databaseConfig)


export default connection 