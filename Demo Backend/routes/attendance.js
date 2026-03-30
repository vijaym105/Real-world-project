const express    = require("express");
const Attendance = require("../models/Attendance");
const protect    = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// ─── GET /api/attendance?year=2024&month=5 ───────────────────────────────────
// month is 0-indexed to match JavaScript's Date (0 = January)
router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    const mm    = String(parseInt(month) + 1).padStart(2, "0");
    const start = `${year}-${mm}-01`;
    const end   = `${year}-${mm}-31`;

    const records = await Attendance.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });

    res.json(records.map((r) => r.date));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/attendance ────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Date required" });

    await Attendance.findOneAndUpdate(
      { user: req.user._id, date },
      { user: req.user._id, date },
      { upsert: true, new: true }
    );
    res.json({ message: "Marked", date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/attendance/:date ────────────────────────────────────────────
router.delete("/:date", async (req, res) => {
  try {
    await Attendance.findOneAndDelete({
      user: req.user._id,
      date: req.params.date,
    });
    res.json({ message: "Unmarked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
