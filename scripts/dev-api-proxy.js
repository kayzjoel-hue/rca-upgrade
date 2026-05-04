// server.js — minimal mock for /api/ai
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", (req, res) => {
  const { prompt, mode } = req.body || {};
  const text = mode === "trade"
    ? `**Mock Trade Proposal**\n\nReceived: ${prompt}`
    : `**Mock Safari Plan**\n\nReceived: ${prompt}`;
  setTimeout(() => res.json({ text }), 300);
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mock API running at http://localhost:${port}`));