const mongoose = require("mongoose");
const { ROLES, EMPLOYEE_STATUSES } = require("./constants");
const validator = require("validator");
const toJson = require("@meanie/mongoose-to-json");
const bcrypt = require("bcryptjs");

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        const usernameRegex = /^[a-zA-Z0-9_-]{6,16}$/;
        if (!validator.matches(value, usernameRegex)) {
          throw new Error(
            "Invalid username: It must be 6-16 characters long and contain only letters, numbers, underscores, or hyphens."
          );
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password should contain atleast one uppercase and lowercase letter, number and special character"
          );
        }
      },
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      default: ROLES[1],
    },
    status: {
      type: String,
      enum: EMPLOYEE_STATUSES,
      required: true,
      default: EMPLOYEE_STATUSES[0],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

authSchema.statics.isUsernameTaken = async function (username) {
  const auth = await this.findOne({ username });
  return !!auth;
};

authSchema.pre("save", async function (next) {
  const auth = this;
  if (auth.isModified("password")) {
    auth.password = await bcrypt.hash(auth.password, 8);
  }
  next();
});

authSchema.methods.isPasswordMatch = async function (password) {
  const auth = this;
  return bcrypt.compare(password, auth.password);
};

authSchema.plugin(toJson);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
