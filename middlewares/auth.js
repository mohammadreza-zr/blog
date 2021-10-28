exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(404).redirect("404");
};
