import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import {config} from "./config.js"
import {handlerReadiness}  from "./handlers/health.js";
import {handlerValchip, handlerGetChirps, GetChirpOne, DeleteChirpRequest} from "./handlers/chips.js";
import {middlewareLogResponses} from "./app/log.js";
import {middlewareMetricsInc, errorMiddleWare,} from "./app/middleware.js";
import { handlerMetrics } from "./app/api/handlerMetrics.js";
import {handlerReset} from "./app/api/reset.js";
import {handlerUsers, handlerLogin, resetPassword} from "./handlers/handlerUsers.js"
import { refreshToken, revokeRefreshToken } from "./handlers/auth.js";
import { handlerMakeRed } from "./handlers/webhooks.js";



const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(middlewareLogResponses);


app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(GetChirpOne(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(DeleteChirpRequest(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerValchip(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsers(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerMakeRed(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(refreshToken(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(revokeRefreshToken(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
  Promise.resolve(resetPassword(req, res)).catch(next);
});

app.use(errorMiddleWare);

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
