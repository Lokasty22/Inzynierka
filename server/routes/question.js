const express = require("express");
const router = express.Router();
const {
  getUserQuestionById,
  getQuestions,
  getAnswers,
  createQuestion,
  editQuestion,
  deleteQuestion,
  addAnswer,
  editAnswer,
  deleteAnswer,
} = require("../controllers/questionsController");
const tokenVerification = require("../middleware/tokenVerification");

router.get("/", getQuestions);
router.get("/:id", getUserQuestionById);

router.post("/", tokenVerification, createQuestion);
router.put("/:id", tokenVerification, editQuestion);
router.delete("/:id", tokenVerification, deleteQuestion);

router.get("/:id/answers", getAnswers);
router.post("/:id/answers", tokenVerification, addAnswer);
router.put("/:id/answers/:answerId", tokenVerification, editAnswer);
router.delete("/:id/answers/:answerId", tokenVerification, deleteAnswer);

module.exports = router;
