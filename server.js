// ============================================================
//  Fitness Buddy — Main Server
//  IBM Cloud watsonx.ai (IBM Granite) powered fitness coach
// ============================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRouter = require("./routes/chat");
const workoutRouter = require("./routes/workout");
const nutritionRouter = require("./routes/nutrition");
const motivationRouter = require("./routes/motivation");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ───────────────────────────────────────────────
app.use("/api/chat", chatRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/motivation", motivationRouter);

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Fitness Buddy",
    model: process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct",
    timestamp: new Date().toISOString(),
  });
});

// ── SPA fallback ─────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏋️  Fitness Buddy is running at http://localhost:${PORT}`);
  console.log(`📡  IBM Granite model : ${process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct"}`);
  console.log(`🌐  watsonx.ai URL    : ${process.env.WATSONX_URL || "not set"}\n`);
});
