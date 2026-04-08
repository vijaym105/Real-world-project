// backend/models/PushSubscription.js
const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscription: { type: Object, required: true }, // full browser push subscription object
    endpoint:     { type: String, required: true, unique: true },
    active:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);
