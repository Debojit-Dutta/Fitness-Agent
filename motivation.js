// ============================================================
//  Route: /api/motivation
//  Daily motivational tips and habit-building endpoint
// ============================================================
const express = require("express");
const router = express.Router();
const { generateText } = require("../services/watsonxClient");
const motivationData = require("../data/motivation");

// GET /api/motivation/daily — return today's motivational tip
router.get("/daily", (req, res) => {
  const dayIndex = new Date().getDay(); // 0–6
  const tip = motivationData.tips[dayIndex % motivationData.tips.length];
  const quote = motivationData.quotes[dayIndex % motivationData.quotes.length];
  res.json({ tip, quote, day: new Date().toLocaleDateString("en-US", { weekday: "long" }) });
});

// POST /api/motivation/habit-plan — AI-generated habit building plan
router.post("/habit-plan", async (req, res) => {
  try {
    const {
      currentHabits = "none",
      desiredGoal = "be healthier",
      timeAvailable = "30 minutes per day",
      challenges = "lack of time",
    } = req.body;

    const prompt = `You are Fitness Buddy, a habit-building and wellness coach powered by IBM Granite AI.

Create a personalized 4-week habit-building plan for someone who wants to improve their fitness and health:
- Current Habits: ${currentHabits}
- Desired Goal: ${desiredGoal}
- Time Available Daily: ${timeAvailable}
- Main Challenges: ${challenges}

Include:
1. Week-by-week progression plan
2. Daily micro-habits (small, actionable, 5-minute habits)
3. Weekly milestones to track progress
4. Strategies to overcome the mentioned challenges
5. One motivational affirmation for each week

Make it realistic, compassionate, and encouraging.`;

    const plan = await generateText(prompt, { max_new_tokens: 700 });

    res.json({
      desiredGoal,
      timeAvailable,
      plan,
      generatedBy: "IBM Granite via watsonx.ai",
    });
  } catch (err) {
    console.error("Habit plan error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
