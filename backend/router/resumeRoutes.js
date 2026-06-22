const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { analyzeResume } = require("../controllers/resumeController");

router.post("/analyze", analyzeResume);
router.get("/download/:userId", resumeController.downloadReport);
module.exports = router;
