const Yup = require("yup");

exports.schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "عنوان نباید کمتر از ۳ کاراکتر باشد")
    .max(100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .required("عنوان الزامی می باشد"),
  category: Yup.string().max(200, "دسته بندی نباید بیشتر از ۲۰۰ کاراکتر باشد"),
  body: Yup.string().required("پست جدید باید دارای محتوا باشد"),
  status: Yup.mixed().oneOf(
    ["public", "private"],
    "یکی از دو وضعیت خصوصی یا عمومی را انتخاب کنید"
  ),
  thumbnail: Yup.object().shape({
    name: Yup.string().required("عکس بند انگشتی الزامی می باشد"),
    size: Yup.number().max(3000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "تنها پسوند های png و gpeg پشتیبانی می شود"
    ),
  }),
});
