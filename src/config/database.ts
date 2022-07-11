import pg from "pg";
import './setupEnv.ts'

const { Pool } = pg;
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.MODE === `PROD` ? false : true,
  },
};

const connection = new Pool(databaseConfig)


export default connection 
