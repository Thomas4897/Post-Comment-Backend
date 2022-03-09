const aboutPage = (req, res) => {
  res.render("about");
};

const postFormPage = (req, res) => {
  res.render("post-form");
};

const loginFormPage = (req, res) => {
  res.render("login-form");
};

const signupFormPage = (req, res) => {
  res.render("signup-form");
};

const commentFormPage = (req, res) => {
  res.render("comment-form");
};

const currentUserPage = (req, res) => {
  res.render("current-user");
};

module.exports = {
  aboutPage,
  postFormPage,
  loginFormPage,
  signupFormPage,
  commentFormPage,
  currentUserPage,
};
