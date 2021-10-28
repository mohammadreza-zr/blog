const mongoose = require("mongoose");
const { schema } = require("./secure/userValidation");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "نام و نام خانوادگی الزامی می باشد"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "ایمیل الزامی می باشد"],
    unique: [true, "ایمیل وارد شده قبلا ثبت شده است"],
  },
  password: {
    type: String,
    required: [true, "کلمه عبور الزامی می باشد"],
    minLength: [4, "کلمه عبور نباید کمتر از ۴ کاراکتر باشد"],
    maxLength: [255, "کلمه عبور نباید بیشتر از ۲۵۵ کاراکتر باشد"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
