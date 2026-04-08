
const express          = require("express");
const webpush          = require("web-push");
const cron             = require("node-cron");
const protect          = require("../middleware/auth");
const PushSubscription = require("../models/PushSubscription");
const DailyStat        = require("../models/DailyStat");
const User             = require("../models/User");

const router = express.Router();

// ─── Configure VAPID ─────────────────────────────────────────────────────────
webpush.setVapidDetails(
  "mailto:" + (process.env.VAPID_EMAIL || "punekarvijay10@gmail.com"),
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ─── GET /api/reminders/vapid-key ─────────────────────────────────────────────
// Frontend calls this to get the public key for push subscription
router.get("/vapid-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// ─── POST /api/reminders/subscribe ───────────────────────────────────────────
router.post("/subscribe", protect, async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription?.endpoint)
      return res.status(400).json({ message: "Invalid subscription" });

    // Upsert — replace existing subscription for this endpoint
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        user:         req.user._id,
        subscription: subscription,
        endpoint:     subscription.endpoint,
        active:       true,
      },
      { upsert: true, new: true }
    );

    // Send a welcome notification
    await sendPush(subscription, {
      title: "FitTrack Notifications ON ✅",
      body:  "You'll now get reminders for water, calories, heart rate & sleep.",
      tag:   "fittrack-welcome",
    });

    res.json({ message: "Subscribed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/reminders/unsubscribe ─────────────────────────────────────────
router.post("/unsubscribe", protect, async (req, res) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.findOneAndUpdate(
      { endpoint, user: req.user._id },
      { active: false }
    );
    res.json({ message: "Unsubscribed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/reminders/test ─────────────────────────────────────────────────
// Send a test notification to current user (for development)
router.post("/test", protect, async (req, res) => {
  try {
    const subs = await PushSubscription.find({
      user: req.user._id, active: true,
    });
    if (!subs.length)
      return res.status(404).json({ message: "No active subscriptions" });

    for (const sub of subs) {
      await sendPush(sub.subscription, {
        title: "FitTrack Test 🎯",
        body:  "This is a test notification — it's working!",
        tag:   "fittrack-test",
      });
    }
    res.json({ message: "Test notification sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Helper: send a single push notification ──────────────────────────────────
async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    // 410 = subscription expired, mark as inactive
    if (err.statusCode === 410) {
      await PushSubscription.findOneAndUpdate(
        { endpoint: subscription.endpoint },
        { active: false }
      );
    }
    return false;
  }
}

// ─── Helper: build reminder message based on stat value ───────────────────────
function getReminderMessage(type, value, goal) {
  const messages = {
    water: {
      low:  { title: "💧 Drink Water!", body: `You've had ${value}L today. Goal: ${goal}L. Stay hydrated!` },
      done: { title: "💧 Water Goal Met!", body: `Amazing — ${value}L today. Keep it up!` },
    },
    calories: {
      low:  { title: "🔥 Fuel Your Body", body: `Only ${value} kcal logged. Target: ${goal} kcal. Time to eat!` },
      high: { title: "🔥 Calorie Check", body: `${value} kcal today vs ${goal} target. Consider lighter meals.` },
      done: { title: "🔥 Calorie Goal Met!", body: `${value} kcal — right on track today!` },
    },
    bpm: {
      high: { title: "❤️ High Heart Rate", body: `Your BPM is ${value}. Consider rest or light stretching.` },
      low:  { title: "❤️ Log Your BPM", body: "Don't forget to log your heart rate today." },
    },
    sleep: {
      low:  { title: "⏰ Bedtime Reminder", body: `You logged ${value}hrs sleep. Aim for ${goal}hrs for recovery.` },
      done: { title: "⏰ Well Rested!", body: `${value}hrs sleep — great recovery!` },
    },
  };

  const pct = value / goal;

  if (type === "water") {
    return pct >= 1 ? messages.water.done : messages.water.low;
  }
  if (type === "calories") {
    if (pct >= 0.9 && pct <= 1.1) return messages.calories.done;
    if (pct < 0.7) return messages.calories.low;
    if (pct > 1.15) return messages.calories.high;
    return null; // within acceptable range
  }
  if (type === "bpm") {
    if (value > 100) return messages.bpm.high;
    if (value === 0) return messages.bpm.low;
    return null;
  }
  if (type === "sleep") {
    return pct >= 1 ? messages.sleep.done : messages.sleep.low;
  }
  return null;
}

// ─── Scheduled reminders with node-cron ──────────────────────────────────────
// This runs automatically when the server starts

function startReminderScheduler() {
  const GOALS = { water: 3, calories: 2000, sleep: 8 };

  // Water reminder every 2 hours during the day (8am - 10pm)
  cron.schedule("0 8,10,12,14,16,18,20,22 * * *", async () => {
    console.log("⏰ Running water reminders...");
    await sendReminderForAll("water", GOALS.water);
  });

  // Calorie check at noon and 6pm
  cron.schedule("0 12,18 * * *", async () => {
    console.log("⏰ Running calorie reminders...");
    await sendReminderForAll("calories", GOALS.calories);
  });

  // BPM reminder at 9am
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running BPM reminders...");
    await sendBpmReminders();
  });

  // Sleep reminder at 10pm
  cron.schedule("0 22 * * *", async () => {
    console.log("⏰ Running sleep reminders...");
    await sendReminderForAll("sleep", GOALS.sleep);
  });

  console.log("✅ Reminder scheduler started");
}

async function sendReminderForAll(type, goal) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Get all active subscriptions
    const subs = await PushSubscription.find({ active: true });

    for (const sub of subs) {
      // Get today's stat for this user
      const stat = await DailyStat.findOne({ user: sub.user, date: today });
      const value = stat?.[type] || 0;

      const msg = getReminderMessage(type, value, goal);
      if (msg) {
        await sendPush(sub.subscription, { ...msg, tag: `fittrack-${type}` });
      }
    }
  } catch (err) {
    console.error(`Reminder error (${type}):`, err.message);
  }
}

async function sendBpmReminders() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const subs  = await PushSubscription.find({ active: true });

    for (const sub of subs) {
      const stat = await DailyStat.findOne({ user: sub.user, date: today });
      const bpm  = stat?.bpm || 0;

      const msg = getReminderMessage("bpm", bpm, 80);
      if (msg) {
        await sendPush(sub.subscription, { ...msg, tag: "fittrack-bpm" });
      }
    }
  } catch (err) {
    console.error("BPM reminder error:", err.message);
  }
}

// Export both the router and the scheduler starter
module.exports = { router, startReminderScheduler };
