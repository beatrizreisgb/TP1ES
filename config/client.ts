import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbPath = path.resolve(__dirname, '../prisma/dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

const prisma = new PrismaClient({ adapter });

export default prisma;
