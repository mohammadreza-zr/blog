const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalali");

exports.getDashboard = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    res.render("private/blogs", {
      pageTitle: "بخش مدریت | داشبورد",
      path: "/dashboard",
      layout: "./layouts/dashLayout",
      fullName: req.user.fullName,
      blogs,
      formatDate,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddPost = (req, res) => {
  res.render("private/addPost", {
    pageTitle: "بخش مدیریت | ساخت پست جدید",
    path: "/dashboard/add-post",
    layout: "./layouts/dashLayout",
    fullName: req.user.fullName,
  });
};

exports.createPost = async (req, res) => {
  console.log(req.body);
  try {
    await Blog.create({ ...req.body, user: req.user.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};
