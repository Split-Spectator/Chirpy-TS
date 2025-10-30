process.loadEnvFile()
 
 type APIConfig = {
    fileserverHits: number;
    dbURL: string;
  };
  
 
  export function getEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable ${key}`);
    return val;
  }
 
  export const config: APIConfig = {
    fileserverHits: 0,
    dbURL:  getEnv("DATABASE_URL)"),
  };