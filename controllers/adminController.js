const multer = require("multer");
const sharp = require("sharp");
const uuid = require("uuid").v4;

const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalali");
const { get500 } = require("./errorController");
const { storage, fileFilter } = require("../utils/multer");

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
    get500(req, res);
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
  const errorArr = [];
  try {
    await Blog.postValidation(req.body);
    await Blog.create({ ...req.body, user: req.user.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("private/addPost", {
      pageTitle: "بخش مدیریت | ساخت پست جدید",
      path: "/dashboard/add-post",
      layout: "./layouts/dashLayout",
      fullName: req.user.fullName,
      errors: errorArr,
    });
  }
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter,
  }).single("image");
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file) {
        const fileName = `${uuid()}_${req.file.originalname}`;
        await sharp(req.file.buffer)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
      } else {
        res.send("جهت آپلود باید عکسی انتخاب کنید");
      }
    }
  });
};
