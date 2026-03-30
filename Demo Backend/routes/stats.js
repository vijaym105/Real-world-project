const express   = require("express");
const DailyStat = require("../models/DailyStat");
const protect   = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// ─── GET /api/stats/today ───────────────────────────────────────────────────
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const stat  = await DailyStat.findOne({ user: req.user._id, date: today });
    res.json(stat || { water: 0, calories: 0, bpm: 72, sleep: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/stats/today ───────────────────────────────────────────────────
// Creates or updates today's stats (upsert)
router.put("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { water, calories, bpm, sleep } = req.body;

    const stat = await DailyStat.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $set: { water, calories, bpm, sleep } },
      { new: true, upsert: true }
    );
    res.json(stat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/stats/weekly ──────────────────────────────────────────────────
// Last 7 days — used to power the chart
router.get("/weekly", async (req, res) => {
  try {
    const stats = await DailyStat.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(stats.reverse()); // oldest → newest for chart
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
