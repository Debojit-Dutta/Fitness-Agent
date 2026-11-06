// ============================================================
//  Fitness Buddy — Frontend Application
//  IBM Granite AI · IBM Cloud watsonx.ai
// ============================================================

// ── Globals ──────────────────────────────────────────────────
let chatHistory = [];
let isWaiting = false;

const $ = (id) => document.getElementById(id);
const $q = (sel) => document.querySelector(sel);
const $qa = (sel) => document.querySelectorAll(sel);

// ── Initialization ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  checkHealth();
  setupTabs();
  setupChat();
  loadWorkoutCards("beginner");
  loadMealCards("breakfast");
  loadMotivation();
  loadChallengeCards();
  setupWorkoutForm();
  setupNutritionForm();
  setupHabitForm();
});

// ── Health Check ──────────────────────────────────────────────
async function checkHealth() {
  const dot  = $("statusDot");
  const text = $("statusText");
  try {
    const res  = await fetch("/api/health");
    const data = await res.json();
    dot.classList.add("online");
    text.textContent = data.model || "IBM Granite";
  } catch {
    dot.classList.add("error");
    text.textContent = "Offline";
  }
}

// ── Tab Switching ─────────────────────────────────────────────
function setupTabs() {
  $qa(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      $qa(".tab-btn").forEach((b) => b.classList.remove("active"));
      $qa(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $("tab-" + tabId).classList.add("active");
    });
  });
}

// ── Chat ──────────────────────────────────────────────────────
function setupChat() {
  const input  = $("chatInput");
  const btn    = $("sendBtn");
  const counter = $("charCount");

  input.addEventListener("input", () => {
    const len = input.value.length;
    counter.textContent = `${len} / 1000`;
    // Auto-resize
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  btn.addEventListener("click", sendMessage);

  // Quick prompt buttons
  $qa(".quick-btn").forEach((qb) => {
    qb.addEventListener("click", () => {
      input.value = qb.dataset.prompt;
      input.dispatchEvent(new Event("input"));
      sendMessage();
    });
  });
}

async function sendMessage() {
  const input = $("chatInput");
  const text  = input.value.trim();
  if (!text || isWaiting) return;

  isWaiting = true;
  $("sendBtn").disabled = true;

  // Remove welcome message on first user message
  const welcome = $q(".welcome-message");
  if (welcome) welcome.remove();

  appendMessage("user", text);
  input.value = "";
  input.style.height = "auto";
  $("charCount").textContent = "0 / 1000";

  showTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: chatHistory }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    appendMessage("bot", data.reply);
    chatHistory.push({ user: text, assistant: data.reply });
    // Keep last 10 exchanges
    if (chatHistory.length > 10) chatHistory.shift();

  } catch (err) {
    appendMessage("bot", `⚠️ Error: ${err.message}`);
  } finally {
    showTyping(false);
    isWaiting = false;
    $("sendBtn").disabled = false;
    input.focus();
  }
}

function appendMessage(role, text) {
  const msgs = $("chatMessages");
  const div  = document.createElement("div");
  div.className = `msg ${role}`;

  const avatar = role === "user" ? "🧑" : "🏋️";
  const time   = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  div.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${escHtml(text)}</div>
      <div class="msg-time">${time}</div>
    </div>`;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping(show) {
  $("typingIndicator").style.display = show ? "flex" : "none";
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

// ── Workout Cards ─────────────────────────────────────────────
async function loadWorkoutCards(level) {
  const container = $("workoutCards");
  container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)">Loading workout cards…</div>`;

  try {
    const res  = await fetch(`/api/workout/quick?level=${level}`);
    const data = await res.json();
    renderWorkoutCard(container, data.plan);
  } catch {
    container.innerHTML = `<p style="color:var(--text-muted)">Could not load workout cards.</p>`;
  }
}

function renderWorkoutCard(container, plan) {
  container.innerHTML = `
    <div class="workout-card">
      <div class="wc-header">
        <div class="wc-name">🏃 ${plan.name}</div>
      </div>
      <div class="wc-meta">
        <span class="wc-badge">⏱ ${plan.duration}</span>
        <span class="wc-badge calories">🔥 ${plan.calories}</span>
      </div>
      <ul class="exercise-list">
        ${plan.exercises.map(ex => `
          <li>
            <span>${ex.name}</span>
            <span class="ex-reps">${ex.sets} × ${ex.reps} | ${ex.rest} rest</span>
          </li>`).join("")}
      </ul>
      <div class="wc-tip">💡 ${plan.tip}</div>
    </div>`;
}

function setupWorkoutForm() {
  // Level tab switcher
  $qa(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $qa(".level-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadWorkoutCards(btn.dataset.level);
    });
  });

  // AI generation
  $("generateWorkoutBtn").addEventListener("click", async () => {
    const btn    = $("generateWorkoutBtn");
    const result = $("workoutResult");
    const body   = $("workoutResultBody");

    btn.disabled = true;
    btn.innerHTML = `<span class="loading-spinner"></span> Generating…`;
    result.style.display = "none";

    try {
      const res = await fetch("/api/workout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fitnessLevel: $("fitnessLevel").value,
          goal:         $("workoutGoal").value,
          duration:     parseInt($("workoutDuration").value),
          equipment:    $("workoutEquipment").value,
          focusArea:    $("focusArea").value,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      body.innerHTML = escHtml(data.plan);
      result.style.display = "block";
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      body.textContent = `Error: ${err.message}`;
      result.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.innerHTML = "🤖 Generate AI Workout Plan";
    }
  });
}

// ── Nutrition Cards ───────────────────────────────────────────
async function loadMealCards(type) {
  const container = $("mealCards");
  container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)">Loading meals…</div>`;

  try {
    const res  = await fetch(`/api/nutrition/meal?type=${type}`);
    const data = await res.json();
    renderMealCard(container, data.meal);
  } catch {
    container.innerHTML = `<p style="color:var(--text-muted)">Could not load meals.</p>`;
  }
}

function renderMealCard(container, meal) {
  container.innerHTML = `
    <div class="meal-card">
      <div class="mc-name">🍽️ ${meal.name}</div>
      <div class="mc-stats">
        <span class="mc-badge">🔥 ${meal.calories}</span>
        <span class="mc-badge protein">💪 Protein: ${meal.protein}</span>
      </div>
      <ul class="ingredient-list">
        ${meal.ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul>
      <div class="mc-tip">💡 ${meal.tip}</div>
    </div>`;
}

function setupNutritionForm() {
  // Meal type tabs
  $qa(".meal-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $qa(".meal-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      loadMealCards(tab.dataset.type);
    });
  });

  // AI meal plan
  $("generateNutritionBtn").addEventListener("click", async () => {
    const btn    = $("generateNutritionBtn");
    const result = $("nutritionResult");
    const body   = $("nutritionResultBody");

    btn.disabled = true;
    btn.innerHTML = `<span class="loading-spinner"></span> Generating…`;
    result.style.display = "none";

    try {
      const res = await fetch("/api/nutrition/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal:               $("nutritionGoal").value,
          dietaryPreference:  $("dietaryPref").value,
          allergies:          $("allergies").value || "none",
          mealsPerDay:        parseInt($("mealsPerDay").value),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      body.innerHTML = escHtml(data.suggestion);
      result.style.display = "block";
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      body.textContent = `Error: ${err.message}`;
      result.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.innerHTML = "🤖 Generate AI Meal Plan";
    }
  });
}

// ── Motivation & Habits ───────────────────────────────────────
async function loadMotivation() {
  const hero = $("motivationHero");
  try {
    const res  = await fetch("/api/motivation/daily");
    const data = await res.json();
    hero.innerHTML = `
      <div class="mh-day">${data.day}</div>
      <div class="mh-title">${data.tip.title}</div>
      <div class="mh-content">${data.tip.content}</div>
      <div class="mh-action">✅ Today's Action: ${data.tip.action}</div>
      <div class="mh-quote">
        <blockquote>"${data.quote.text}"</blockquote>
        <cite>— ${data.quote.author}</cite>
      </div>`;
  } catch {
    hero.innerHTML = `<div class="mh-title">Stay consistent. Every step counts! 💪</div>`;
  }
}

function loadChallengeCards() {
  const challenges = [
    { week: 1, focus: "Movement 🚶",    text: "Walk or move for at least 10 minutes every day this week." },
    { week: 2, focus: "Hydration 💧",   text: "Drink 8 glasses of water every single day this week." },
    { week: 3, focus: "Sleep 😴",       text: "Sleep 7-8 hours every night. No screens 30 min before bed." },
    { week: 4, focus: "Nutrition 🥗",   text: "Eat at least 3 servings of vegetables every day this week." },
  ];
  const container = $("challengeCards");
  container.innerHTML = challenges.map((c) => `
    <div class="challenge-card">
      <div class="cc-week">Week ${c.week}</div>
      <div class="cc-focus">${c.focus}</div>
      <div class="cc-text">${c.text}</div>
    </div>`).join("");
}

function setupHabitForm() {
  $("generateHabitBtn").addEventListener("click", async () => {
    const btn    = $("generateHabitBtn");
    const result = $("habitResult");
    const body   = $("habitResultBody");

    btn.disabled = true;
    btn.innerHTML = `<span class="loading-spinner"></span> Generating…`;
    result.style.display = "none";

    try {
      const res = await fetch("/api/motivation/habit-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desiredGoal:    $("habitGoal").value || "be healthier",
          timeAvailable:  $("habitTime").value,
          currentHabits:  $("currentHabits").value || "none",
          challenges:     $("mainChallenge").value,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      body.innerHTML = escHtml(data.plan);
      result.style.display = "block";
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      body.textContent = `Error: ${err.message}`;
      result.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.innerHTML = "🤖 Generate My Habit Plan";
    }
  });
}

// ── Utility ───────────────────────────────────────────────────
function copyResult(containerId) {
  const text = document.getElementById(containerId + "Body").innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`#${containerId} .copy-btn`);
    const orig = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = orig), 2000);
  });
}
