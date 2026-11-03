const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    template: {
      type: String,
      enum: ["grid", "ledger", "signal", "original"],
      default: "original",
    },

    resumeData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Draft", draftSchema);