
const Resume = require("../models/resume.model");

// 1. Save a new resume
const createResume = async (req, res) => {
  try {
    const { title, template, resumeData } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({
        message: "Resume data is required",
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      title: title?.trim() || "Untitled Resume",
      template: template || "grid",
      resumeData,
    });

    return res.status(201).json({
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(500).json({
      message: "Failed to save resume",
    });
  }
};

// 2. Get all resumes of the logged-in user
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};

// 3. Get one resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    console.error("Get resume error:", error);
    return res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};

// 4. Update an existing resume
const updateResume = async (req, res) => {
  try {
    const { title, template, resumeData } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Resume title cannot be empty",
        });
      }
      updates.title = title.trim();
    }

    if (template !== undefined) {
      if (!["grid", "ledger", "signal", "original"].includes(template)) {
        return res.status(400).json({
          message: "Invalid template",
        });
      }
      updates.template = template;
    }

    if (resumeData !== undefined) {
      if (
        !resumeData ||
        typeof resumeData !== "object" ||
        Array.isArray(resumeData)
      ) {
        return res.status(400).json({
          message: "Invalid resume data",
        });
      }
      updates.resumeData = resumeData;
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    console.error("Update resume error:", error);
    return res.status(500).json({
      message: "Failed to update resume",
    });
  }
};

// 5. Delete a resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    console.error("Delete resume error:", error);
    return res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
