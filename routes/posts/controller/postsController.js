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
    console.log(allPosts);
    // res.status(200).json(allPost);
    res.render("show-all-posts", { posts: allPosts });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const onePost = await Post.findById(postId).populate("commentHistory");
    if (!onePost) {
      throw { message: "Cannot find post" };
    }

    res.status(200).render("show-one-post", { post: onePost });
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

    const decodedUser = res.locals.decodedToken;
    const foundUser = await User.findOne({ email: decodedUser.email });

    const foundPost = await Post.findById(postId);
    if (!foundPost) throw { message: "Post not found" };

    if (foundUser._id.toString() === foundPost.postOwner.toString()) {
      const deletedPost = await Post.findByIdAndDelete(postId);

      //we will use deleteMany({ post: id })
      //find other comments based on user
      //looks for those comments, find the users of those comments
      //delete based on id
      if (foundPost.commentHistory.length > 0) {
        const foundComments = await Comment.find({ postId: postId });
        if (!foundComment) throw { message: "Comment not found" };

        await foundComments.map(async (comment) => {
          console.log(comment);
          let commentUser = await User.findById(comment.commentOwner);
          await commentUser.commentHistory.pull(comment._id.toString());
          await commentUser.save();
        });

        await Comment.deleteMany({ postId: postId });
        // await Comment.save();
      }

      await foundUser.postHistory.pull(postId);
      await foundUser.save();

      res.status(200).json({
        message: "post was deleted",
        deletePost: deletedPost,
        deletedInUser: foundUser,
      });
    } else {
      throw { message: "You do not have the permission to delete" };
    }
    //delete post
    //delete post id from user postHistory
    //check if there are comments under this post, and delete those comments if its there
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error", error: error });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostById,
};
