// ============================================================
//  IBM watsonx.ai — Granite LLM Client
//  Handles authentication and text generation requests
// ============================================================
const axios = require("axios");

const WATSONX_URL = process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com";
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_MODEL_ID = process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct";

let _cachedToken = null;
let _tokenExpiry = 0;

// ── Get IBM IAM Bearer Token ─────────────────────────────────
async function getIAMToken() {
  const now = Date.now();
  if (_cachedToken && now < _tokenExpiry) return _cachedToken;

  const response = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: WATSONX_API_KEY,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  _cachedToken = response.data.access_token;
  // Expire 5 minutes before actual expiry
  _tokenExpiry = now + (response.data.expires_in - 300) * 1000;
  return _cachedToken;
}

// ── Core text generation via IBM Granite ─────────────────────
async function generateText(prompt, options = {}) {
  // If no real API key is configured, return a mock response for demo
  if (!WATSONX_API_KEY || WATSONX_API_KEY === "your_ibm_cloud_api_key_here") {
    return getMockResponse(prompt);
  }

  const token = await getIAMToken();
  const url = `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`;

  const payload = {
    model_id: WATSONX_MODEL_ID,
    input: prompt,
    parameters: {
      decoding_method: options.decoding_method || "greedy",
      max_new_tokens: options.max_new_tokens || 512,
      min_new_tokens: options.min_new_tokens || 10,
      stop_sequences: options.stop_sequences || [],
      repetition_penalty: options.repetition_penalty || 1.1,
      temperature: options.temperature || 0.7,
    },
    project_id: WATSONX_PROJECT_ID,
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data.results[0].generated_text.trim();
}

// ── Mock responses for demo / no-API-key mode ────────────────
function getMockResponse(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("workout") || lower.includes("exercise") || lower.includes("training")) {
    return `Here's a great home workout for you! 💪

**Full-Body Home Workout (30 minutes)**
1. Warm-up: 5 min light jogging in place + arm circles
2. Push-ups: 3 sets × 12 reps
3. Bodyweight Squats: 3 sets × 15 reps
4. Plank Hold: 3 × 30 seconds
5. Lunges: 3 sets × 10 reps each leg
6. Mountain Climbers: 3 sets × 20 reps
7. Cool-down: 5 min stretching

**Tips:** Rest 60 seconds between sets. Stay hydrated! 🥤
This routine requires zero equipment and can be done anywhere.`;
  }

  if (lower.includes("meal") || lower.includes("food") || lower.includes("nutrition") || lower.includes("eat")) {
    return `Here are some nutritious meal ideas for you! 🥗

**Healthy Meal Suggestions:**

🌅 **Breakfast:** Oatmeal with banana, berries, and a drizzle of honey. Add a boiled egg for protein.

🌞 **Lunch:** Grilled chicken salad with mixed greens, cherry tomatoes, cucumber, and olive oil dressing.

🌙 **Dinner:** Baked salmon with steamed broccoli and quinoa. Rich in omega-3 and protein!

🍎 **Snacks:** Apple with peanut butter, mixed nuts, or Greek yogurt with granola.

💧 **Remember:** Drink 8 glasses of water daily! Proper hydration boosts metabolism by up to 30%.`;
  }

  if (lower.includes("motivat") || lower.includes("inspir") || lower.includes("tip")) {
    return `Here's your daily dose of fitness motivation! 🌟

**"The only bad workout is the one that didn't happen."**

✅ Start small — even 10 minutes of movement counts
✅ Track your progress — celebrate small wins
✅ Find a workout buddy for accountability
✅ Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound
✅ Rest and recovery are just as important as exercise

**Today's Challenge:** Do 20 push-ups right now! Your future self will thank you. 🏆

Remember: Consistency beats perfection every time. You've got this! 💪`;
  }

  if (lower.includes("habit") || lower.includes("routine") || lower.includes("schedule")) {
    return `Let's build healthy habits together! 📅

**7-Day Habit Building Plan:**

| Day | Morning | Evening |
|-----|---------|---------|
| Mon | 15-min walk + stretch | Meal prep for week |
| Tue | Strength training | Light yoga |
| Wed | Active rest + hydration check | Journaling |
| Thu | Cardio (30 min) | Breathing exercises |
| Fri | Full body workout | Gratitude practice |
| Sat | Outdoor activity | Relaxation |
| Sun | Rest + reflection | Plan next week |

**Key Habits to Start:**
🌅 Wake up 30 min earlier for movement
💧 Drink water before coffee
🥗 Eat veggies with every meal
📱 Limit screen time before bed`;
  }

  return `Hello! I'm Fitness Buddy, your AI-powered health and fitness coach! 🏋️‍♂️

I'm here to help you with:
💪 **Workout Plans** — Home workouts, gym routines, yoga, cardio
🥗 **Nutrition Advice** — Meal ideas, healthy recipes, diet tips
🌟 **Motivation** — Daily inspiration, goal setting, progress tracking
📅 **Habit Building** — Routines, schedules, consistency tips

What would you like to work on today? Ask me anything about fitness, nutrition, or healthy living!`;
}

module.exports = { generateText };
