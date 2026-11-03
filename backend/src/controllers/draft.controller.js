const Draft = require("../models/draft.model");

// Get logged-in user's draft
const getDraft = async (req, res) => {
  try {
    const draft = await Draft.findOne({
      user: req.user.id,
    });

    return res.status(200).json({ draft });
  } catch (error) {
    console.error("Get draft error:", error);
    return res.status(500).json({
      message: "Failed to fetch draft",
    });
  }
};

// Create or update logged-in user's draft
const saveDraft = async (req, res) => {
  try {
    const { template, resumeData } = req.body;

    if (
      !resumeData ||
      typeof resumeData !== "object" ||
      Array.isArray(resumeData)
    ) {
      return res.status(400).json({
        message: "Valid resume data is required",
      });
    }

    if (
      template &&
      !["grid", "ledger", "signal", "original"].includes(template)
    ) {
      return res.status(400).json({
        message: "Invalid template",
      });
    }

    const draft = await Draft.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          template: template || "original",
          resumeData,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "Draft autosaved successfully",
      draft,
    });
  } catch (error) {
    console.error("Save draft error:", error);
    return res.status(500).json({
      message: "Failed to autosave draft",
    });
  }
};

// Delete logged-in user's draft
const deleteDraft = async (req, res) => {
  try {
    await Draft.findOneAndDelete({
      user: req.user.id,
    });

    return res.status(200).json({
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Delete draft error:", error);
    return res.status(500).json({
      message: "Failed to delete draft",
    });
  }
};

module.exports = {
  getDraft,
  saveDraft,
  deleteDraft,
};