import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  migrate: {
    database: {
      url: process.env.DATABASE_URL!,
    },
  },
});
