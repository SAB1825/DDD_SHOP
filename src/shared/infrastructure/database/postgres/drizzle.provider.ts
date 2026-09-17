import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDb = PostgresJsDatabase<typeof schema>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDb> => {
    const connectionString = configService.getOrThrow<string>('PG_DB_URL');
    const client = postgres(connectionString);
    const db = drizzle(client, {
      schema,
    });
    // await db.execute(sql`SELECT 1`);
    return db;
  },
};
