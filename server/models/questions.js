const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const questionsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    title: { type: String, required: true, minLength: 10, maxLength: 20 },
    description: {
      type: String,
      required: true,
      minLength: 15,
      maxLength: 500,
    },
    comment: [commentSchema],
  },
  { timestamps: true }
);

const validateQuestion = (question) => {
  const schema = Joi.object({
    subject: Joi.string().min(1).max(20),
    title: Joi.string().min(10).max(50).required(),
    description: Joi.string().min(15).max(500).required(),
  });

  return schema.validate(question);
};

const validateAnswer = (answer) => {
  const schema = Joi.object({
    teacher: Joi.string().required(),
    comment: Joi.string().min(10).required(),
  });

  return schema.validate(answer);
};

function validateAnswerEdit(answer) {
  const schema = Joi.object({
    comment: Joi.string().min(10).max(500).required(),
  });
  return schema.validate(answer);
}


const Question = mongoose.model("Question", questionsSchema);

module.exports = { Question, validateAnswer, validateQuestion, validateAnswerEdit };
