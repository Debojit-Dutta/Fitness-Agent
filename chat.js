// ============================================================
//  Route: /api/chat
//  Main conversational endpoint powered by IBM Granite
// ============================================================
const express = require("express");
const router = express.Router();
const { generateText } = require("../services/watsonxClient");

// Fitness Buddy system persona injected into every prompt
const SYSTEM_PROMPT = `You are Fitness Buddy, a friendly, knowledgeable, and motivating AI-powered health and fitness coach. You were built using IBM Granite AI on IBM Cloud watsonx.ai.

Your expertise includes:
- Home and gym workout routines for all fitness levels (beginner, intermediate, advanced)
- Nutritious and practical meal ideas and basic dietary guidance
- Habit-building strategies and daily routine planning
- Motivational support and consistency coaching
- Mental wellness tips related to fitness

Guidelines:
- Always be encouraging, positive, and non-judgmental
- Provide practical, actionable advice
- Keep responses clear, structured, and easy to follow
- Use bullet points, numbered lists, or tables when helpful
- Always recommend consulting a doctor before starting any new fitness program
- Do NOT provide medical diagnoses or prescribe medications
- Focus on general wellness, not extreme dieting or dangerous practices`;

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Build conversation context from history (last 6 exchanges)
    const recentHistory = history.slice(-6);
    let conversationContext = "";
    recentHistory.forEach((entry) => {
      conversationContext += `User: ${entry.user}\nAssistant: ${entry.assistant}\n\n`;
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversationContext}User: ${message.trim()}\nAssistant:`;

    const reply = await generateText(fullPrompt, {
      max_new_tokens: 600,
      temperature: 0.75,
      repetition_penalty: 1.1,
    });

    res.json({
      reply,
      model: process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chat route error:", err.message);
    res.status(500).json({
      error: "Unable to reach IBM Granite. Please check your API credentials.",
      details: err.message,
    });
  }
});

module.exports = router;
