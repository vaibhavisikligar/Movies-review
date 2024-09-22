const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      min: 10,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exits"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value); // Use validator.isEmail for validation
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    confirmpassword: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
