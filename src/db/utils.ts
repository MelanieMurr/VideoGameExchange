import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const createDbConnection = () => drizzle(process.env.DATABASE_URL!);
