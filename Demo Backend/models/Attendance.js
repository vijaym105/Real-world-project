const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },  // "2024-01-15"
  },
  { timestamps: true }
);

// One attendance record per user per date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
