process.loadEnvFile()
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverhits: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
  platform: string;
};
  
 
  export function getEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable ${key}`);
    return val;
  }
 
  export const config: Config = {
    api: {
      fileserverhits: 0,
    },
    db: {
      url: getEnv("DB_URL"),
      migrationConfig: migrationConfig,
      platform: getEnv("PLATFORM"),
    }
  };