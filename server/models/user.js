const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: ["Nauczyciel", "Uczeń", "Admin"],
    required: true,
  },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, default: "" },
  birthDate: { type: Date, default: null },
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  balance: { type: Number, default: 0.0, set: (v) => parseFloat(v.toFixed(2)) },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      balance: this.balance,
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" },
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.string().required().label("Phone Number"),
    role: Joi.string().valid("Nauczyciel", "Uczeń").required(),
    password: passwordComplexity().required().label("Password"),
    gender: Joi.string().label("Gender"),
    birthDate: Joi.date().label("Birth Date"),
    country: Joi.string().label("Country"),
    state: Joi.string().label("State"),
    city: Joi.string().label("City"),
    profilePicture: Joi.string().label("Profile Picture"),
    bio: Joi.string().label("Bio"),
    balance: Joi.number().precision(2).min(0).default(0).label("Balance"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
