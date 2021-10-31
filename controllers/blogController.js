const ObjectId = require("mongoose").ObjectId;

const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");

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
    let tags;
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
