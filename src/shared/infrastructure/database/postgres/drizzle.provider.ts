import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDb = PostgresJsDatabase<{}>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDb> => {
    const connectionString = configService.getOrThrow<string>('PG_DB_URL');
    const client = postgres(connectionString);
    const db = drizzle(client, {});
    // await db.execute(sql`SELECT 1`);
    return db;
  },
};
