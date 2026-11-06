// ============================================================
//  Route: /api/nutrition
//  Meal suggestions and nutrition guidance endpoint
// ============================================================
const express = require("express");
const router = express.Router();
const { generateText } = require("../services/watsonxClient");
const nutritionData = require("../data/nutrition");

// GET /api/nutrition/meal — return a random meal suggestion
router.get("/meal", (req, res) => {
  const type = req.query.type || "any";
  const validTypes = ["breakfast", "lunch", "dinner", "snack"];
  const key = validTypes.includes(type)
    ? type
    : validTypes[Math.floor(Math.random() * validTypes.length)];
  const meals = nutritionData[key];
  const meal = meals[Math.floor(Math.random() * meals.length)];
  res.json({ type: key, meal });
});

// POST /api/nutrition/suggest — AI-personalized nutrition advice
router.post("/suggest", async (req, res) => {
  try {
    const {
      goal = "maintain weight",
      dietaryPreference = "no restriction",
      allergies = "none",
      mealsPerDay = 3,
    } = req.body;

    const prompt = `You are Fitness Buddy, a nutrition expert powered by IBM Granite AI.

Create a simple, healthy, and practical daily meal plan for:
- Health Goal: ${goal}
- Dietary Preference: ${dietaryPreference}
- Allergies/Restrictions: ${allergies}
- Meals Per Day: ${mealsPerDay}

Include:
1. Each meal with simple ingredients and brief preparation notes
2. Approximate calorie estimate per meal
3. Hydration tips
4. One practical nutrition habit to adopt this week

Keep it realistic, budget-friendly, and easy to prepare.`;

    const suggestion = await generateText(prompt, { max_new_tokens: 650 });

    res.json({
      goal,
      dietaryPreference,
      allergies,
      mealsPerDay,
      suggestion,
      generatedBy: "IBM Granite via watsonx.ai",
    });
  } catch (err) {
    console.error("Nutrition suggest error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
