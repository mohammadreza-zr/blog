const Yup = require("yup");

exports.schema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "نام و نام خانوادگی نباید کمتر از ۲ کاراکتر باشد")
    .max(255, "نام و نام خانوادگی نباید بیشتر از ۲۵۵ کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی می باشد"),
  email: Yup.string()
    .email("ایمیل وارد شده معتبر نمی باشد")
    .required("ایمیل الزامی می باشد"),
  password: Yup.string()
    .min(4, "کلمه عبور نباید کمتر از ۴ کاراکتر باشد")
    .max(255, "کلمه عبور نباید بیشتر از ۲۵۵ کاراکتر باشد")
    .required("کلمه عبور الزامی می باشد"),
  confirmPassword: Yup.string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([Yup.ref("password"), null], "تکرار کلمه عبور تطابق ندارد"),
});
exports.validateEmail = Yup.object().shape({
  email: Yup.string()
    .email("ایمیل وارد شده معتبر نمی باشد")
    .required("ایمیل الزامی می باشد"),
});
