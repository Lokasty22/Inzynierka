const Joi = require("joi");
const mongoose = require("mongoose");

const newsletterScheme = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true},
    isSubscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const validateNewsletter = (newsletters) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const schema = Joi.object({
    subscribtionEmail: Joi.string().pattern(emailRegex).required()
  });
  return schema.validate(newsletters);
};

const Newsletter = mongoose.model("Newsletter", newsletterScheme);

module.exports = {Newsletter, validateNewsletter};
