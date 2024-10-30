import express from "express";
import cors from "cors";
import addBuildJob from "./job-queue";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/build", async (req, res) => {
  await addBuildJob({
    project_id: Math.random().toString(36).substring(7),
    build_number: 1,
    project_config: {
      branch: "main",
      buildCommand: "npm run build",
      rootDir: "frontend",
      outputDir: "build",
      environment: {}
    },
    github_token: "some token",
    github_url: "some url",
  })
  
  res.json({ message: "Build job added successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});