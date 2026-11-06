// ============================================================
//  Workout Data — Pre-built workout plans by fitness level
// ============================================================
module.exports = {
  beginner: [
    {
      name: "Morning Energizer",
      duration: "20 min",
      calories: "150-200 kcal",
      exercises: [
        { name: "Jumping Jacks", sets: 2, reps: "20", rest: "30s" },
        { name: "Wall Push-ups", sets: 2, reps: "10", rest: "30s" },
        { name: "Chair Squats", sets: 2, reps: "12", rest: "30s" },
        { name: "Standing March", sets: 2, reps: "30s", rest: "20s" },
        { name: "Seated Leg Raises", sets: 2, reps: "10", rest: "30s" },
      ],
      tip: "Focus on form over speed. Breathe consistently throughout!",
    },
    {
      name: "Full Body Starter",
      duration: "25 min",
      calories: "180-220 kcal",
      exercises: [
        { name: "March in Place", sets: 1, reps: "3 min", rest: "none" },
        { name: "Knee Push-ups", sets: 3, reps: "8", rest: "45s" },
        { name: "Bodyweight Squats", sets: 3, reps: "10", rest: "45s" },
        { name: "Superman Hold", sets: 2, reps: "10s hold", rest: "30s" },
        { name: "Side Leg Raises", sets: 2, reps: "12 each", rest: "30s" },
      ],
      tip: "Stay hydrated! Drink water before, during, and after.",
    },
  ],
  intermediate: [
    {
      name: "HIIT Power Circuit",
      duration: "30 min",
      calories: "280-350 kcal",
      exercises: [
        { name: "High Knees", sets: 3, reps: "40s", rest: "20s" },
        { name: "Push-ups", sets: 3, reps: "15", rest: "45s" },
        { name: "Jump Squats", sets: 3, reps: "12", rest: "45s" },
        { name: "Plank", sets: 3, reps: "45s", rest: "30s" },
        { name: "Burpees", sets: 3, reps: "8", rest: "60s" },
        { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "30s" },
      ],
      tip: "Push yourself but listen to your body. Modify if needed.",
    },
    {
      name: "Strength & Tone",
      duration: "35 min",
      calories: "250-320 kcal",
      exercises: [
        { name: "Diamond Push-ups", sets: 3, reps: "12", rest: "45s" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "10 each", rest: "60s" },
        { name: "Pike Push-ups", sets: 3, reps: "10", rest: "45s" },
        { name: "Glute Bridges", sets: 3, reps: "15", rest: "30s" },
        { name: "Tricep Dips (chair)", sets: 3, reps: "12", rest: "45s" },
      ],
      tip: "Slow and controlled movements build more muscle than fast reps.",
    },
  ],
  advanced: [
    {
      name: "Elite HIIT Challenge",
      duration: "45 min",
      calories: "400-500 kcal",
      exercises: [
        { name: "Explosive Push-ups", sets: 4, reps: "15", rest: "30s" },
        { name: "Pistol Squats", sets: 3, reps: "8 each", rest: "60s" },
        { name: "Plyometric Burpees", sets: 4, reps: "10", rest: "45s" },
        { name: "Handstand Hold (wall)", sets: 3, reps: "20s", rest: "60s" },
        { name: "Single-leg Deadlift", sets: 3, reps: "10 each", rest: "45s" },
        { name: "L-Sit Hold", sets: 3, reps: "15s", rest: "60s" },
      ],
      tip: "Warm up thoroughly and ensure perfect form to avoid injury.",
    },
  ],
};
