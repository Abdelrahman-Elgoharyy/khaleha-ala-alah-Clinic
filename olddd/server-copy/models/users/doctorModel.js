const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

// Define the Doctor schema
const doctorSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address.",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 8 }),
        message: "Password must contain at least 8 characters.",
      },
    },
    fixedSlots: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        hour: {
          type: String, // You can choose an appropriate data type (e.g., Date, String) for the hour
          required: true,
        },
      },
    ],
    username: {
      type: String,
      required: true,
      unique: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    affiliation: {
      type: String,
      required: true,
    },
    educationalBackground: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Export the Doctor model
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;