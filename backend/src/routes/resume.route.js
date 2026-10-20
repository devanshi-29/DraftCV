
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const resumeController = require("../controllers/resume.controller");

// All resume routes require login
router.use(authMiddleware);

// Create a new resume
router.post("/", resumeController.createResume);

// Get all resumes of the logged-in user
router.get("/", resumeController.getMyResumes);

// Get one resume
router.get("/:id", resumeController.getResumeById);

// Update a resume
router.put("/:id", resumeController.updateResume);

// Delete a resume
router.delete("/:id", resumeController.deleteResume);

module.exports = router;
