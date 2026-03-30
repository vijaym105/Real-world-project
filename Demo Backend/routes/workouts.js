const express = require("express");
const Workout = require("../models/Workout");
const protect = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// ─── GET /api/workouts?date=2024-01-15 ──────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.date) filter.date = req.query.date;

    const workouts = await Workout.find(filter).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/workouts ─────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, type, duration, notes } = req.body;

    if (!name || !duration)
      return res.status(400).json({ message: "Name and duration are required" });

    const today   = new Date().toISOString().split("T")[0];
    const workout = await Workout.create({
      user: req.user._id,
      name, type, duration, notes,
      date: today,
      completed: false,
    });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PATCH /api/workouts/:id/toggle ─────────────────────────────────────────
router.patch("/:id/toggle", async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!workout)
      return res.status(404).json({ message: "Workout not found" });

    workout.completed = !workout.completed;
    await workout.save();
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/workouts/:id ────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id:  req.params.id,
      user: req.user._id,
    });
    if (!workout)
      return res.status(404).json({ message: "Workout not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
