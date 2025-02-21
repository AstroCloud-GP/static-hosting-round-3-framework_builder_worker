import express from "express";
import cors from "cors";
import mainRouter from "./routes/routes";
import { initResultWorker } from "./services/result-queue";

initResultWorker();

const app = express();
app.use(cors());
app.use(express.json());

app.use(mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

