# Fitness Buddy 🏋️ — AI-Powered Health & Fitness Coach

> **Problem Statement #14 — Syllabus and Curriculum Design**
> Built with **IBM Granite AI** on **IBM Cloud watsonx.ai (Lite Tier)**

---

## Overview

Fitness Buddy is a conversational, AI-powered health and fitness coach that provides on-demand fitness advice, healthy lifestyle suggestions, and basic nutrition guidance — all tailored to individual needs and available at any time.

### Core Features

| Feature | Description |
|---|---|
| 💬 **AI Chat Coach** | Conversational fitness advice powered by IBM Granite |
| 💪 **Workout Planner** | Personalized home workout plans for all fitness levels |
| 🥗 **Nutrition Guide** | Smart meal ideas and dietary guidance |
| 🌟 **Daily Motivation** | Inspirational tips and quotes updated daily |
| 📅 **Habit Builder** | 4-week habit-building plans tailored to your goals |

---

## Technology Stack

| Layer | Technology |
|---|---|
| **AI Model** | IBM Granite (`ibm/granite-3-8b-instruct`) |
| **AI Platform** | IBM Cloud watsonx.ai (Lite — free tier) |
| **Backend** | Node.js + Express.js |
| **Frontend** | Vanilla HTML5 + CSS3 + JavaScript (no framework) |
| **Authentication** | IBM IAM API Key |

---

## IBM Cloud Setup Guide

### Step 1 — Create an IBM Cloud Account
1. Go to [https://cloud.ibm.com](https://cloud.ibm.com)
2. Sign up for a **free Lite account**

### Step 2 — Create a watsonx.ai Project
1. Navigate to **watsonx.ai** in the IBM Cloud catalog
2. Create a new project
3. Copy your **Project ID** from project settings

### Step 3 — Get Your API Key
1. Go to **Manage → Access (IAM) → API Keys**
2. Click **Create an IBM Cloud API key**
3. Copy and securely store your API key

### Step 4 — Configure the Application
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and fill in your credentials:
# WATSONX_API_KEY=<your-api-key>
# WATSONX_PROJECT_ID=<your-project-id>
# WATSONX_URL=https://us-south.ml.cloud.ibm.com
# WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
```

---

## Installation & Running

### Prerequisites
- **Node.js** v18+ — [https://nodejs.org](https://nodejs.org)
- npm v8+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your IBM Cloud credentials in .env

# 3. Start the server
npm start

# 4. Open in browser
# http://localhost:3000
```

### Development Mode (with auto-restart)
```bash
npm run dev
```

---

## Project Structure

```
fitness-buddy/
├── server.js                 # Express application entry point
├── package.json              # Node.js dependencies
├── .env.example              # Environment variables template
├── .env                      # Your local credentials (never commit!)
│
├── services/
│   └── watsonxClient.js      # IBM Granite AI client + IAM auth
│
├── routes/
│   ├── chat.js               # POST /api/chat — main AI conversation
│   ├── workout.js            # GET/POST /api/workout
│   ├── nutrition.js          # GET/POST /api/nutrition
│   └── motivation.js         # GET/POST /api/motivation
│
├── data/
│   ├── workouts.js           # Pre-built workout plans by level
│   ├── nutrition.js          # Healthy meal suggestions
│   └── motivation.js         # Daily tips, quotes, habit challenges
│
└── public/
    ├── index.html            # Single-page application shell
    ├── css/
    │   └── style.css         # Complete responsive stylesheet
    └── js/
        └── app.js            # Frontend application logic
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/chat` | IBM Granite AI conversation |
| `GET` | `/api/workout/quick?level=beginner` | Quick workout card |
| `POST` | `/api/workout/generate` | AI-generated workout plan |
| `GET` | `/api/nutrition/meal?type=breakfast` | Random meal suggestion |
| `POST` | `/api/nutrition/suggest` | AI meal plan |
| `GET` | `/api/motivation/daily` | Daily tip + quote |
| `POST` | `/api/motivation/habit-plan` | AI 4-week habit plan |

---

## Demo Mode

If no IBM Cloud API key is configured, the application runs in **demo mode** with intelligent pre-built responses for:
- Workout requests
- Meal/nutrition requests
- Motivation requests
- Habit building requests

---

## Disclaimer

> This application is for general wellness purposes only. Always consult a qualified healthcare professional or certified fitness trainer before starting any new exercise or diet program.

---

*Fitness Buddy — Problem Statement #14 | Built with ❤️ using IBM Granite AI on IBM Cloud watsonx.ai*
