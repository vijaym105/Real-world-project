const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:      { type: String, required: true, trim: true },
    type:      { type: String, default: "Cardio" },
    duration:  { type: Number, required: true },   // minutes
    notes:     { type: String, default: "" },
    completed: { type: Boolean, default: false },
    date:      { type: String, required: true },   // "2024-01-15"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
