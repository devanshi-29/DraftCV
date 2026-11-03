const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const draftController = require("../controllers/draft.controller");

// All draft routes require login
router.use(authMiddleware);

// Get user's draft
router.get("/", draftController.getDraft);

// Create or update user's draft
router.put("/", draftController.saveDraft);

// Delete user's draft
router.delete("/", draftController.deleteDraft);

module.exports = router;