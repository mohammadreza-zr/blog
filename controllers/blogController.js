const ObjectId = require("mongoose").ObjectId;
const Yup = require("yup");

const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");
const { sendEmail } = require("../utils/mailer");

exports.getIndex = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 5;
  try {
    const numberOfPost = await Blog.find({
      status: "public",
    }).countDocuments();
    const posts = await Blog.find({ status: "public" })
      .sort({
        createdAt: "desc",
      })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.render("index", {
      pageTitle: "وبلاگ",
      path: "/",
      posts,
      formatDate,
      truncate,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: postPerPage * page < numberOfPost,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPost / postPerPage),
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id }).populate("user");
    if (!post) return res.redirect("errors/404");
    let tags = [];
    if (post.category.length > 0) {
      tags = post.category.split("-");
    }
    res.render("post", {
      pageTitle: post.title,
      path: "/post",
      post,
      formatDate,
      tags,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("errors/500");
  }
};

exports.getContactPage = (req, res) => {
  res.render("contact", {
    pageTitle: "تماس با ما",
    path: "/contact",
    message: req.flash("success_msg"),
    error: req.flash("error"),
    errors: [],
  });
};
exports.handleContactPage = async (req, res) => {
  const errorArr = [];

  const { fullName, email, message, captcha } = req.body;

  const schema = Yup.object().shape({
    fullName: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
    email: Yup.string()
      .email("آدرس ایمیل صحیح نیست")
      .required("ایمیل الزامی می باشد"),
    message: Yup.string().required("پیام اصلی الزامی می باشد"),
  });
  try {
    await schema.validate(req.body, { abortEarly: false });
    //todo captcha validation
    sendEmail(
      email,
      fullName,
      "پیام از طرف وبلاگ",
      `${message} <br/> ایمیل کاربر: <br/> ${email}`,
      "پیام"
    );
    req.flash("success_msg", "پیام شما با موفقیت ارسال شد");
    res.render("contact", {
      pageTitle: "تماس با ما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: errorArr,
    });
  } catch (err) {
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("contact", {
      pageTitle: "تماس با ما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: errorArr,
    });
  }
};
