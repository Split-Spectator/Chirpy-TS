import express from "express";
import {handlerReadiness}  from "./handlers/health.js";
import {handlerValchip} from "./handlers/validateChirp.js";
import {middlewareLogResponses} from "./app/log.js";
import {middlewareMetricsInc} from "./app/middleMetrics.js";
import { handlerMetrics } from "./app/api/handlerMetrics.js";
import {handlerReset} from "./app/api/reset.js";

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(middlewareLogResponses);


app.get("/admin/metrics", handlerMetrics);
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValchip)
app.post("/admin/reset", handlerReset);

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
