const mongoose = require("mongoose");

const dailyStatSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date:     { type: String, required: true },  // "2024-01-15"
    water:    { type: Number, default: 0 },       // liters
    calories: { type: Number, default: 0 },       // kcal
    bpm:      { type: Number, default: 72 },      // beats per minute
    sleep:    { type: Number, default: 0 },       // hours
  },
  { timestamps: true }
);

// One stat document per user per date
dailyStatSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyStat", dailyStatSchema);
