// frontend/src/components/DietSection.jsx
// Shows personalized diet recommendations based on user's calories and BPM
// Place this BELOW the calendar section in DashboardPage.jsx right panel

import { useApp } from "../context/AppContext.jsx";

// Calculate BMR using Harris-Benedict formula
function calcBMR(user) {
  const weight = parseFloat(user?.weight) || 70;  // kg
  const height = parseFloat(user?.height) || 170; // cm
  const age    = 25; // default if not stored
  const isMale = user?.gender?.toLowerCase() !== "female";

  if (isMale) {
    return 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);s
  } else {
    return 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
  }
}

// Determine activity level from BPM
function getActivityLevel(bpm) {
  if (bpm < 60)  return { label: "Athletic",  multiplier: 1.725, color: "#c6f135" };
  if (bpm < 70)  return { label: "Active",    multiplier: 1.55,  color: "#4fc3f7" };
  if (bpm < 80)  return { label: "Moderate",  multiplier: 1.375, color: "#ffa940" };
  return              { label: "Sedentary",  multiplier: 1.2,   color: "#ff6b6b" };
}

// Generate meal suggestions based on calorie target
function getMealPlan(targetCalories, calories) {
  const deficit = targetCalories - calories;
  const isLow   = calories < targetCalories * 0.7;
  const isHigh  = calories > targetCalories * 1.1;

  if (isLow) return {
    status: "Under-eating",
    color:  "#ff6b6b",
    tip:    "You need more fuel! Add nutrient-dense foods.",
    meals:  [
      { time: "Breakfast", suggestion: "Oats + banana + peanut butter", kcal: 450 },
      { time: "Lunch",     suggestion: "Brown rice + grilled chicken + veggies", kcal: 600 },
      { time: "Snack",     suggestion: "Greek yogurt + nuts + honey", kcal: 300 },
      { time: "Dinner",    suggestion: "Salmon + sweet potato + salad", kcal: 550 },
    ],
  };

  if (isHigh) return {
    status: "Over-eating",
    color:  "#ffa940",
    tip:    "Try lighter meals and more water to stay on track.",
    meals:  [
      { time: "Breakfast", suggestion: "Eggs + whole grain toast + fruit", kcal: 350 },
      { time: "Lunch",     suggestion: "Large salad + tuna + lemon dressing", kcal: 400 },
      { time: "Snack",     suggestion: "Apple + almond butter", kcal: 200 },
      { time: "Dinner",    suggestion: "Grilled veggies + lean protein + soup", kcal: 450 },
    ],
  };

  return {
    status: "On Track",
    color:  "#c6f135",
    tip:    "Great balance! Maintain this eating pattern.",
    meals:  [
      { time: "Breakfast", suggestion: "Eggs + avocado + whole grain toast", kcal: 400 },
      { time: "Lunch",     suggestion: "Quinoa bowl + grilled veggies + hummus", kcal: 550 },
      { time: "Snack",     suggestion: "Mixed nuts + fruit", kcal: 250 },
      { time: "Dinner",    suggestion: "Chicken stir-fry + brown rice", kcal: 500 },
    ],
  };
}

export default function DietSection() {
  const { state } = useApp();
  const { calories, bpm } = state.stats;
  const user = state.user;

  const bmr           = Math.round(calcBMR(user));
  const activity      = getActivityLevel(bpm);
  const targetCalories = Math.round(bmr * activity.multiplier);
  const plan          = getMealPlan(targetCalories, calories);

  const consumed = calories || 0;
  const pct      = Math.min(Math.round((consumed / targetCalories) * 100), 100);

  return (
    <div className="card diet-section">
      <div className="card__header">
        <h3>Diet Plan</h3>
        <span
          className="diet-section__status"
          style={{ background: plan.color + "22", color: plan.color }}
        >
          {plan.status}
        </span>
      </div>

      {/* Calorie ring summary */}
      <div className="diet-section__summary">
        <div className="diet-section__ring-wrap">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f4f8" strokeWidth="8"/>
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke={plan.color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <text x="40" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a2e">{consumed}</text>
            <text x="40" y="50" textAnchor="middle" fontSize="9"  fill="#888">kcal</text>
          </svg>
        </div>

        <div className="diet-section__numbers">
          <div className="diet-section__num-row">
            <span>Consumed</span>
            <strong style={{ color: plan.color }}>{consumed} kcal</strong>
          </div>
          <div className="diet-section__num-row">
            <span>Target</span>
            <strong>{targetCalories} kcal</strong>
          </div>
          <div className="diet-section__num-row">
            <span>BMR</span>
            <strong>{bmr} kcal</strong>
          </div>
          <div className="diet-section__num-row">
            <span>Activity</span>
            <strong style={{ color: activity.color }}>{activity.label}</strong>
          </div>
        </div>
      </div>

      <p className="diet-section__tip">{plan.tip}</p>

      {/* Meal suggestions */}
      <div className="diet-section__meals">
        {plan.meals.map((meal) => (
          <div key={meal.time} className="diet-section__meal">
            <div className="diet-section__meal-header">
              <span className="diet-section__meal-time">{meal.time}</span>
              <span className="diet-section__meal-kcal">{meal.kcal} kcal</span>
            </div>
            <p className="diet-section__meal-suggestion">{meal.suggestion}</p>
          </div>
        ))}
      </div>

      {/* BPM note */}
      <div className="diet-section__bpm-note">
        <span style={{ color: activity.color }}>❤️ {bpm} bpm</span>
        <span>→ {activity.label} lifestyle → {targetCalories} kcal/day target</span>
      </div>
    </div>
  );
}
