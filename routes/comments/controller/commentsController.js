const Post = require("../../posts/model/Post");
const User = require("../../users/model/User");
const Comment = require("../model/Comment");

const { errorHandler } = require("../../../utils/errorHandler");
// const { post } = require("../..");

const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    const decodedData = res.locals.decodedToken;

    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    const foundPost = await Post.findById(postId);

    if (!foundPost) {
      throw { message: "Post not found." };
    }

    const newComment = new Comment({
      postId: foundPost.id,
      comment: comment,
      commentOwner: foundUser.id,
    });

    const savedComment = await newComment.save();

    foundPost.commentHistory.push(savedComment.id);
    foundUser.commentHistory.push(savedComment.id);

    await foundUser.save();
    await foundPost.save();

    res
      .status(200)
      .json({ message: "Saved new comment", payload: savedComment });
  } catch (error) {
    res.status(500).json(errorHandler(error));
  }
};

const getAllComments = async (req, res) => {
  try {
    const decodedData = res.locals.decodedToken;

    const foundUser = await User.findOne({ email: decodedData.email });
    console.log(foundUser);
    if (!foundUser) {
      throw { message: "User not found." };
    }

    let allComments = await Comment.find({ commentOwner: foundUser.id });

    if (allComments.length <= 0) {
      throw { message: "No comments created yet." };
    }

    res.status(200).json({ payload: allComments });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { postId } = req.body;

    const decodedData = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    const foundComment = await Comment.findById(postId);

    if (!foundComment) {
      throw { message: "Comment not found." };
    }

    if (foundUser.id.toString() !== foundComment.commentOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this comment. Cannot Update!",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Updated Comment", payload: updatedComment });
  } catch (error) {
    res.status(500).json({ message: "Error", error: errorHandler(error) });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    const decodedData = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedData.email });

    if (!foundUser) {
      throw { message: "User not found." };
    }

    const foundComment = await Comment.findById(commentId);

    if (!foundComment) {
      throw { message: "Comment not found." };
    }

    const foundPost = await Post.findOne({ postId: foundComment.postId });

    if (!foundPost) {
      throw { message: "Post not found." };
    }

    if (foundUser.id.toString() !== foundComment.commentOwner.toString()) {
      return res.status(500).json({
        message: "Error: You are not the owner of this comment. Cannot Delete!",
      });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (deletedComment === null) {
      throw new Error("No post of id is found, cannot delete");
    }

    const pullIdFromUserArray = foundUser.commentHistory.pull(commentId);
    const pullIdFromPostArray = foundPost.commentHistory.pull(commentId);

    await foundUser.save();
    await foundPost.save();

    res.status(200).json({
      message: "Comment deleted",
      payload: deletedComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
