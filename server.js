import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import aiHandler from "./api/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const envPath = path.join(rootDir, ".env");

loadLocalEnv(envPath);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.all("/api/ai", aiHandler);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mode: "live",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use(express.static(rootDir));

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(rootDir, "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  const keyStatus = process.env.GEMINI_API_KEY ? "configured" : "missing";
  console.log(`Royal Connect Africa running at http://localhost:${port}`);
  console.log(`Gemini key: ${keyStatus}`);
});

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    process.env[key] = value;
  }
}
