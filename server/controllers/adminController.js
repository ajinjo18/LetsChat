require('dotenv').config();
const jwt = require('jsonwebtoken')

const userCollection = require('../model/users');
const postReportCollection = require('../model/postReport')
const postCollection = require('../model/post')
const userReportCollection = require('../model/userReport')

const login = (req,res) => {
    const  {email, password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign({ email }, process.env.SECRET_KEY);
        return res.status(200).json({message:'Admin Verified', token})
    }
    else{
        return res.status(401).json({ message: 'Admin Not Verified' });
    }
}

const allUsers = async(req,res) => {
    try {
        const data = await userCollection.find()
        return res.status(200).json({data})
    } 
    catch (error) {
        console.log(error.message);
    }
}


const blockUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userCollection.findByIdAndUpdate({_id: userId}, { isBlocked: true }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User blocked successfully', data: user });
    } catch (error) {
        console.error('Error blocking user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const unblockUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userCollection.findByIdAndUpdate({_id: userId}, { isBlocked: false }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User unblocked successfully', data: user });
    } catch (error) {
        console.error('Error unblocking user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const reportedPost = async(req,res) => {
    try {
        const reports = await postReportCollection.find()
        .populate('userId','firstName lastName')
        .populate('postId','images')

        res.status(200).json(reports);
    } catch (error) {
        console.error('Error retrieving reports:', error);
        res.status(500).json({ message: 'Failed to retrieve reports' });
    }
}

const rejectReport = async(req,res) => {
    const { reportId } = req.query;
    try {
        await postReportCollection.findByIdAndUpdate({_id: reportId}, {$set:{status: 'rejected'}});
        res.status(200).json({message:'The report has been rejected'});
    } catch (error) {
        console.error('Error rejecting report:', error);
    }
}

const deletePost = async(req,res) => {
    const {postId, reportId} = req.query;
    try {
        const deletedPost = await postCollection.findByIdAndDelete({_id: postId});

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await postReportCollection.findByIdAndUpdate({_id: reportId}, {$set:{status: 'deleted'}});

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
}

const reportedUser = async(req, res) => {
    try {
        const reports = await userReportCollection.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error retrieving reports:', error);
        res.status(500).json({ message: 'Failed to retrieve reports' });
    }
}

const blockReportedUser = async(req, res) => {
    const { reportedUser, reportId } = req.query;

    try {
        const user = await userCollection.findByIdAndUpdate({_id: reportedUser}, { isBlocked: true }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await userReportCollection.findByIdAndUpdate({_id: reportId}, { status: 'blocked' });

        return res.status(200).json({ message: 'User blocked successfully', data: user });
    } catch (error) {
        console.error('Error blocking user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const rejectReportUser = async(req, res) => {
    const { reportId } = req.query;
    try {
        await userReportCollection.findByIdAndUpdate({_id: reportId}, { status: 'rejected' });
        res.status(200).json({message:'The report has been rejected'});
    } catch (error) {
        console.error('Error rejecting report:', error);
    }
}

const allPosts = async (req, res) => {
    try {
  
        const postData = await postCollection.find({})
            .populate('userId', 'firstName lastName profilePicture _id followers following savedPost')
            .populate('likes', 'firstName lastName profilePicture _id')
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json(postData);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
}

const chart = async(req,res) => {
    try {
        const usersByMonth = await userCollection.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.json(usersByMonth);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    login, allUsers, blockUser, unblockUser, reportedPost, rejectReport, deletePost, reportedUser,
    blockReportedUser, rejectReportUser, allPosts, chart
}