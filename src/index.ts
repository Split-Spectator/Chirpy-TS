import express from "express";
import {handlerReadiness}  from "./handlers/health.js";
import {middlewareLogResponses} from "./app/log.js";
import {middlewareMetricsInc} from "./app/middleMetrics.js";
import { handlerMetrics } from "./app/metrics/handlerMetrics.js";
import {handlerReset} from "./app/reset/reset.js";

const app = express();
const PORT = 8080;



app.use(middlewareLogResponses);

app.get("/metrics", handlerMetrics);
app.get("/healthz", handlerReadiness);
app.get("/reset", handlerReset);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
