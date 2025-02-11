import express from "express";
import cors from "cors";
import addBuildJob from "./job-queue";
import { getAllUsers } from "./models/User";
import mainRouter from "./routes/routes";
import { initResultWorker } from "./result-queue";
import path from "path";

initResultWorker();

const app = express();
app.use(cors());
app.use(express.json());

app.use(mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

