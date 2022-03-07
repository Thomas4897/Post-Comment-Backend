const Post = require("../model/Post");
const User = require("../../users/model/User");
const Comment = require("../../comments/model/Comment");

const { errorHandler } = require("../../../utils/errorHandler");

const createPost = async (req, res) => {
  try {
    const { title, post } = req.body;

    const decodedData = res.locals.decodedToken;

    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    const newPost = new Post({
      title: title,
      post: post,
      postOwner: foundUser.id,
    });

    const savedPost = await newPost.save();

    foundUser.postHistory.push(savedPost.id);

    await foundUser.save();

    res.status(200).json({ message: "Saved new post", payload: savedPost });
  } catch (error) {
    res.status(500).json(errorHandler(error));
  }
};

const getAllPosts = async (req, res) => {
  try {
    // render index.ejs page.
    // pass in the foundAllPosts information as posts

    // IN the index.ejs page console.log(posts)
    // forEach of the posts and display each post's title and post

    let allPosts = await Post.find()
      .populate("postOwner", "username")
      .populate("commentHistory", "comment");

    // if (allPosts.length <= 0) {
    //   throw { message: "No posts created yet." };
    // }

    // res.status(200).json(allPost);
    res.render("index", { posts: allPosts });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const decodedData = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    const foundPost = await Post.findById(postId);

    if (!foundPost) {
      throw { message: "Post not found." };
    }

    if (foundUser.id.toString() !== foundPost.postOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this post. Cannot Update!",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Updated Post", payload: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Error", error: errorHandler(error) });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const decodedData = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedData.email });

    // if (!foundUser) {
    //   throw { message: "User not found." };
    // }

    const foundPost = await Post.findById(postId);

    if (!foundPost) {
      throw { message: "Post not found." };
    }

    if (foundUser.id !== foundPost.postOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this post. Cannot Delete!",
      });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (deletedPost === null) {
      throw new Error("No post of id is found, cannot delete");
    }

    const pullIdFromArray = foundUser.postHistory.pull(postId);

    await foundUser.save();

    // deleteMany
    const deleteComments = await Comment.deleteMany({
      postId: postId,
    });

    // const deleteComments = await User.deleteMany({
    //   commentHistory: postId,
    // });

    res.status(200).json({
      message: "Post deleted",
      payload: deletedPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
};
