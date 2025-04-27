const mongoose = require("mongoose");

const giftcardSchema = new mongoose.Schema(
  {
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    code: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 10 },
    used: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);

const Giftcard = mongoose.model("Giftcard", giftcardSchema);

module.exports = Giftcard;
