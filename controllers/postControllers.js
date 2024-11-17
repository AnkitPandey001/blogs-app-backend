import User from "../models/user.js";
import Post from "../models/postSchema.js";
import Notification from "../models/notification.js";

export const createPost = async (req, res) => {
  try {
    const { text, category,title } = req.body;
    //console.log({ text, category,title })
    let { img } = req.body;
   // console.log({ text, category,title,img })
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    if (!text && !img) {
      return res.status(400).json({
        error: "Post must have text or images",
      });
    }

    if (!['coding', 'news', 'event'].includes(category)) {
      return res.status(400).json({
        error: "Invalid category",
      });
    }

    if(!title){
      return res.status(400).json({
        error: "Invalid Title",
      });
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
      category,
      title
    });
    await newPost.save();

    return res.status(200).json({
      newPost,
      message: "Posted Sucesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const LikeUnlike = async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      error: "Post Not Found",
    });
  }

  const userLike = post.likes.includes(userId);
  if (userLike) {
    await post.updateOne({ $pull: { likes: userId } });
    return res.status(200).json({
      message: "Like removed successfully",
      post
    });
  } else {
    post.likes.push(userId);
    await post.save();
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "Like",
    });
    await notification.save();
  }

  return res.status(200).json({
    message: "Liked",
    post
  });
};

export const commentRoutes = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        error: "Comment must have some text",
      });
    }

    // Await the result of Post.findById
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post Not Found",
      });
    }

    post.comments.push({
      text,
      user: userId,
    });

    await post.save();

    res.status(200).json({
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
 
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    res.status(200).json({message:"Comments Deleted"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: "Post Not Found",
      });
    }

    console.log(post.user);
    console.log(req.user._id);

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({
        error: "Not authorized to delete this post",
      });
    }

    // if(post.img){
    //   await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
    // }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post deleted Sucesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllpost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    //console.log(userId)
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        error:"user not found"
      })
    }

    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
 
      res.status(200).json(feedPosts)
 
    } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

