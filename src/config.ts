process.loadEnvFile()
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};
 
 type APIConfig = {
    fileserverHits: number;
    db: DBConfig;
  };
  
 
  export function getEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable ${key}`);
    return val;
  }
 
  export const config: APIConfig = {
    fileserverHits: 0,
    db: {
      url: getEnv("DB_URL"),
      migrationConfig,
   } 
  };