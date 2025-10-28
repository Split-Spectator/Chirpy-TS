import express from "express";
import {handlerReadiness}  from "./handlers/health.js";
import {middlewareLogResponses} from "./app/log.js";
const app = express();
const PORT = 8080;


app.get("/healthz", handlerReadiness);
app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
