import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'freelance_marketplace';

if (!uri) {
  console.error('Missing MONGODB_URI in server/.env');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbRef = null;

export async function connectDB() {
  if (dbRef) return dbRef;
  await client.connect();
  dbRef = client.db(dbName);
  return dbRef;
}

export function getDB() {
  if (!dbRef) throw new Error('DB not connected. Call connectDB() first.');
  return dbRef;
}

export function collection(name) {
  return getDB().collection(name);
}
