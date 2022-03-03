const Post = require("../model/Post");
const User = require("../../users/model/User");

const { errorHandler } = require("../../../utils/errorHandler");
// const { post } = require("../..");

const createPost = async (req, res) => {
  try {
    // what are goo checks from validator
    const { title, post } = req.body;

    const decodedData = res.locals.decodedToken;

    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    // !!! Create Comment HIstory like postOwner

    // title
    // post
    // commentHistory
    // owner

    const newPost = new Post({
      title: title,
      post: post,
      // commentHistory: foundComment.id,
      postOwner: foundUser.id,
    });

    const savedPost = await newPost.save();

    foundUser.postHistory.push(savedPost.id);

    await foundUser.save();

    // ???Might not be in right location???
    // foundComment.commentHistory.push(savedPost.id);
    // await foundComment.save();

    res.status(200).json({ message: "Saved new post", payload: savedPost });
  } catch (error) {
    res.status(500).json(errorHandler(error));
  }
};

const getAllPosts = async (req, res) => {
  try {
    const decodedData = res.locals.decodedToken;

    const foundUser = await User.findOne({ email: decodedData.email });
    console.log(foundUser);
    if (!foundUser) {
      throw { message: "User not found." };
    }

    let allPost = await Post.find({ postOwner: foundUser.id });

    res.status(200).json({ payload: allPost });
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

    const foundPost = await Post.findOne({ id: postId });

    console.log(foundPost.postOwner.toString());
    console.log(foundUser.id);
    if (foundUser.id !== foundPost.postOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this post. Cannot Update!",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    // console.log(req.body);
    res.status(200).json({ message: "Updated Post", payload: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Error", error: errorHandler(error) });
  }
};

// delete  the order and the id from user's orderHistory
// save user's info (if we delete an id from the array)
const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const decodedData = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    // const foundPost = await Post.findById(postId);
    const foundPost = await Post.findOne({ id: postId });

    if (!foundPost) {
      throw { message: "Post not found." };
    }

    console.log("Post", foundPost.postOwner.toString());
    console.log("User", foundUser.id);
    if (foundUser.id !== foundPost.postOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this post. Cannot Delete!",
      });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (deletedPost === null) {
      throw new Error("No post of id is found, cannot delete");
    }

    // const filterArray = foundUser.orderHistory.filter(
    //   (element) => element.toString() !== id
    // );

    // Alt delete
    const pullIdFromArray = foundUser.postHistory.pull(postId);

    console.log(pullIdFromArray);

    // foundUser.orderHistory = filterArray;
    await foundUser.save();

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
