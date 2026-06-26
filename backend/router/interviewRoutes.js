const express = require("express");
const router = express.Router();

const {
  generateInterview,
  evaluateInterview,
} = require("../controllers/interviewController");

router.post("/generate", generateInterview);
router.post("/evaluate", evaluateInterview);

module.exports = router;
