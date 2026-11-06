// ============================================================
//  Route: /api/workout
//  Personalized workout recommendation endpoint
// ============================================================
const express = require("express");
const router = express.Router();
const { generateText } = require("../services/watsonxClient");
const workoutData = require("../data/workouts");

// GET /api/workout/quick — return a random quick workout card
router.get("/quick", (req, res) => {
  const level = req.query.level || "beginner";
  const validLevels = ["beginner", "intermediate", "advanced"];
  const key = validLevels.includes(level) ? level : "beginner";
  const plans = workoutData[key];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  res.json({ level: key, plan });
});

// POST /api/workout/generate — AI-generated personalized workout
router.post("/generate", async (req, res) => {
  try {
    const {
      fitnessLevel = "beginner",
      goal = "general fitness",
      duration = 30,
      equipment = "none",
      focusArea = "full body",
    } = req.body;

    const prompt = `You are Fitness Buddy, an expert fitness coach powered by IBM Granite AI.

Create a detailed, structured ${duration}-minute home workout plan for the following person:
- Fitness Level: ${fitnessLevel}
- Goal: ${goal}
- Available Equipment: ${equipment}
- Focus Area: ${focusArea}

Include:
1. Warm-up (5 minutes)
2. Main workout with sets, reps, and rest times
3. Cool-down / stretching (5 minutes)
4. Safety tips and modifications

Format the response clearly with sections and bullet points.`;

    const plan = await generateText(prompt, { max_new_tokens: 700 });

    res.json({
      fitnessLevel,
      goal,
      duration,
      equipment,
      focusArea,
      plan,
      generatedBy: "IBM Granite via watsonx.ai",
    });
  } catch (err) {
    console.error("Workout generate error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
