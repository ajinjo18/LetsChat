const postCollection = require('../model/post')
const userCollection = require('../model/users');
const savePostCategory = require('../model/savePostCategory')
const postReportCollection = require('../model/postReport')

const addPost = async (req, res) => {

    const userId = req.user.id;
    const { description } = req.body;

    try {
        const imageUrls = req.files.map(file => file.filename);
        const postData = {
            userId: userId,
            images: imageUrls,
            description: description
        };

        // Insert the new post data
        const newPost = await postCollection.create(postData);

        // Populate the new post with user details
        const populatedPost = await postCollection.findById(newPost._id)
            .populate('userId', 'firstName lastName profilePicture _id')
            .populate('likes', 'firstName lastName profilePicture _id')
            .exec();

        res.status(200).json({ success: true, message: 'Post added successfully', post: populatedPost });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Failed to add post' });
    }
};

const addPostDescription = async (req, res) => {

    const userId = req.user.id;
    const { descriptionOnly } = req.body;

    try {
        const postData = {
            userId: userId,
            description: descriptionOnly
        };

        // Insert the new post data
        const newPost = await postCollection.create(postData);

        // Populate the new post with user details
        const populatedPost = await postCollection.findById(newPost._id)
        .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
        .populate('likes', 'firstName lastName profilePicture _id')
        .exec();

        res.status(200).json({ success: true, message: 'Post added successfully', post: populatedPost });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Failed to add post' });
    }
};

const homeFeeds = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 2;
        const skip = parseInt(req.query.skip) || 0;

        // Find current user and their following list
        const currentUser = await userCollection.findById(userId).populate('following').exec();
        const followingIds = currentUser.following.map(user => user._id);

        const fiveMinutesAgo = new Date(Date.now() - 25 * 60 * 1000);
        const recentUserPosts = await postCollection.find({ userId: userId, createdAt: { $gte: fiveMinutesAgo } })
            .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
            .populate('likes', 'firstName lastName profilePicture _id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        
        // Fetch posts from users the current user is following
        const followingPosts = await postCollection.find({ userId: { $in: followingIds } })
            .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
            .populate('likes', 'firstName lastName profilePicture _id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        // Combine results and remove duplicates
        const postData = [...new Set([...recentUserPosts, ...followingPosts])];

        res.status(200).json(postData);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
};

const getPostById = async (req, res) => {
    
    const { postId } = req.query;
  
    try {
        const postData = await postCollection.findOne({_id: postId})
        .populate('userId', 'firstName lastName profilePicture _id')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'userCollection',
            select: 'firstName lastName profilePicture _id'
          }
        })
        .populate({
          path: 'comments.replies.user',
          model: 'userCollection',
          select: 'firstName lastName profilePicture _id'
        })
        .exec();

        if (postData) {
          postData.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.status(200).json(postData);
    } catch (error) {
        console.error('Error retrieving post:', error);
        res.status(500).json({ error: 'Failed to retrieve post' });
    }
};

const deleteComment = async (req, res) => {
    const { commentId, postId } = req.query;
    const userId = req.user.id;
  
    try {
      const post = await postCollection.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (post.comments[commentIndex].user.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      post.comments.splice(commentIndex, 1);
      await post.save();
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
};

const deleteReply = async (req, res) => {

    const { commentId, replyId, postId } = req.query;
    const userId = req.user.id;

    try {
      const post = await postCollection.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const replyIndex = post.comments[commentIndex].replies.findIndex(reply => reply._id.toString() === replyId);
      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }
  
      if (post.comments[commentIndex].replies[replyIndex].user.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      post.comments[commentIndex].replies.splice(replyIndex, 1);
      await post.save();
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
};

const getBookMarks = async(req,res) => {
  const userId = req.user.id;
  const category = await savePostCategory.find({user: userId})
  .populate('savedPost', 'images')
  .sort({updatedAt:-1})
  res.status(200).json(category);
}

const addCategory = async(req,res) => {
  try {
    const {category} = req.body
    const data = {
      name: category.trim(),
      user: req.user.id
    }
    await savePostCategory.insertMany([data])
    res.json({message:'category added'})
  } catch (error) {
    console.log(error.message);
  }
}

const savePost = async(req,res) => {
  try {
    const {categoryId, postId} = req.body

    const existingCategory = await savePostCategory.findOne(
      { _id: categoryId, user: req.user.id, savedPost: postId }
    );

    if (existingCategory) {
      return res.status(200).json({ message: "Post already exists in saved posts" }); // Informative message
    }

    const updatedCategory = await savePostCategory.findOneAndUpdate(
      { _id: categoryId, user: req.user.id },
      { $addToSet: { savedPost: postId } }, // Use $push to add to the array
      { new: true } // Return the updated document after modification
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found or user mismatch" });
    }
    
    res.status(200).json({ message: "Post successfully added to saved posts", category: updatedCategory });
  } catch (error) {
    console.error(error.message);
  }
}

const postReport = async(req,res) => {
  try {
      const { postId } = req.query;
      const {reason} = req.body
      const userId = req.user.id

      const existingReport = await postReportCollection.findOne({ userId: userId, postId: postId });

      if (existingReport) {
          return res.status(200).json({ message: 'Post already reported by this user' });
      }

      const postReport = {
          userId: userId,
          postId: postId,
          reason: reason
      };
      await postReportCollection.insertMany([postReport])
      res.status(200).json({ message: 'Post Reported successfully' });
  } catch (error) {
      console.error('Error Reporting post:', error);
      res.status(500).json({ message: 'Failed to report post' });
  }
}

const getAllSavedPosts = async(req,res) => {
  try {
    const categoryId = req.body.categoryId
    const category = await savePostCategory.findById(categoryId)
      .populate({
        path: 'savedPost',
        model: 'postCollection',
        populate: {
          path: 'userId',
          model: 'userCollection',
        }
      })

    res.status(200).json(category);

  } catch (err) {
    console.error(err);
  }
}

const myPosts = async (req, res) => {
  try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 2;
      const skip = parseInt(req.query.skip) || 0;
      
      const postData = await postCollection.find({ userId: userId })
          .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
          .populate('likes', 'firstName lastName profilePicture _id')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec();

      res.status(200).json(postData);
  } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

const editCategory = async(req,res) => {
  try {
    const userId = req.user.id;
    const {categoryId, categoryName} = req.body

    await savePostCategory.findOneAndUpdate(
      {_id: categoryId, user: userId },
      {$set:{name: categoryName.trim()}}
    )
    res.status(200).json({message:'updated'})

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to edit' });
  }
}

const deleteCategory = async(req,res) => {
  const userId = req.user.id;
  const categoryId = req.body.categoryId;
  try {
    const result = await savePostCategory.findByIdAndDelete(categoryId);
    if (!result) {
      return res.status(404).send('Document not found');
    }
    res.status(200).json({message:'deleted'})
  } catch (error) {
      res.status(500).send('Error deleting document');
  }
}

const removePavedPost = async(req,res) => {
  const categoryId = req.body.categoryId;
  const postId = req.body.postId

  try {
    await savePostCategory.findByIdAndUpdate(
        categoryId,
        { $pull: { savedPost: postId } },
        { new: true }
    );
    res.status(200).json({message:'post removed'})
  } catch (error) {
      console.error("Error removing saved post:", error);
  }

}

const userPostAndData = async (req, res) => {
  try {
      const userId = req.query.id;
      const limit = parseInt(req.query.limit) || 2;
      const skip = parseInt(req.query.skip) || 0;

      const postData = await postCollection.find({ userId: userId })
          .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
          .populate('likes', 'firstName lastName profilePicture _id')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec();      

      res.status(200).json(postData);
  } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

const deletePost = async(req,res) => {
  const postId = req.body.postId;

  try {
      const deletedPost = await postCollection.findByIdAndDelete(postId);

      if (!deletedPost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Failed to delete post' });
  }
}

const singlePost = async (req, res) => {
  const {id} = req.query
  try {
      // const postData = await postCollection.findById(id)
      // .populate('userId', 'firstName lastName profilePicture _id followers following')
      // .populate('likes', 'firstName lastName profilePicture _id')
      // .exec();

      const postData = await postCollection.find({ _id: id })
      .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
      .populate('likes', 'firstName lastName profilePicture _id')
      .sort({ createdAt: -1 })
      .exec();

      res.status(200).json(postData);
  } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};





module.exports = {
    addPost, addPostDescription, homeFeeds, getPostById, deleteComment, deleteReply,
    getBookMarks, addCategory, savePost, postReport, getAllSavedPosts,singlePost,
    myPosts, editCategory, deleteCategory, removePavedPost, userPostAndData, deletePost
}