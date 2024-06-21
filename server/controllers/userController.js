const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const generateOTP = require('generate-otp');
require('dotenv').config();
const jwt = require('jsonwebtoken')

const userCollection = require('../model/users')
const postCollection = require('../model/post')


// ---------------node mailer--------------
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
});


// ---------------forget password OTP function--------------
const forgetOtpToEmail = async(email) => {
    const otp = generateOTP.generate(6, { digits: true, alphabets: false, specialChars: false });

    await userCollection.findOneAndUpdate({email:email},{$set:{otp}})

    const mailOptions = {
        from: 'letschat8055@gmail.com',
        to: `${email}`,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ' + error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }

        setTimeout(async () => {
            await userCollection.findOneAndUpdate({ email: email }, { $unset: { otp: "" } });
        }, 5 * 60 * 1000); 
        
    });
}


const getUserData = async (req, res) => {
    const userId = req.user.id;
    try {
        const userData = await userCollection.findById(userId)
        res.status(200).json(userData.following);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
}

const getUserDetails = async (req,res) =>{
    const userId = req.user.id;
    try {
        const userData = await userCollection.findById(userId)
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
}

const allFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find the user by their ID and populate the 'following' field with full user details
        const user = await userCollection.findById(userId).populate('following', 'firstName lastName email profilePicture isBlocked isActive createdAt');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // The 'following' field now contains the full details of each followed user
        const followingUsers = user.following;
        res.status(200).json(followingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const suggestFriends = async (req, res) => {
    const userId = req.user.id;
    const limit = 10;

    try {
        const currentUser = await userCollection.findById(userId).populate('following').exec();
        const followingIds = currentUser.following.map(user => user._id);

        // Find friends of friends
        let friendSuggestions = await userCollection.aggregate([
            { $match: { _id: { $in: followingIds } } }, // Get user's friends
            { $unwind: '$following' }, // Unwind friends' following
            { $match: { 'following': { $ne: userId, $nin: followingIds } } }, // Exclude current user and already followed users
            { $group: { _id: '$following', mutualFriends: { $sum: 1 } } }, // Count mutual friends
            { $sort: { mutualFriends: -1 } }, // Sort by mutual friends
            { $limit: limit }, // Limit the number of suggestions
            { $lookup: { from: 'usercollections', localField: '_id', foreignField: '_id', as: 'user' } }, // Lookup user details
            { $unwind: '$user' }, // Unwind user details
            { $project: { _id: '$user._id', firstName: '$user.firstName', lastName: '$user.lastName', profilePicture: '$user.profilePicture', mutualFriends: 1 } } // Project necessary fields
        ]);

        if (friendSuggestions.length <= 1) {
            // If friendSuggestions is empty, select some users from userCollection as default suggestions
            friendSuggestions = await userCollection.aggregate([
                { $match: { _id: { $ne: userId, $nin: followingIds } } }, // Exclude current user and already followed users
                { $sample: { size: limit } }, // Randomly select users
                { $project: { _id: 1, firstName: 1, lastName: 1, profilePicture: 1, mutualFriends: { $literal: 0 } } } // Project necessary fields and set mutualFriends to 0
            ]);
        }

        res.status(200).json(friendSuggestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get friend suggestions' });
    }
};

const postLength = async(req,res) => {
    const {id} = req.query
    try {
        const data = await postCollection.find({ userId: id })
        if(data === null) {
            const userData = await userCollection.findById(id)
            const postData = {
                postLength: 0,
                followersLength: userData.followers.length,
                followingLength: userData.following.length,
            }
            return res.status(200).json(postData);
        }
        if(data.length === 0){
            const userData = await userCollection.findById(id)
            const postData = {
                postLength: 0,
                followersLength: userData.followers.length,
                followingLength: userData.following.length,
            }
            return res.status(200).json(postData);
        }
        else{
            const userData = await userCollection.findById(id)
            const postData = {
                postLength: data.length,
                followersLength: userData.followers.length,
                followingLength: userData.following.length,
            }
            return res.status(200).json(postData)
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
}

const updateProfileImage = async(req,res) => {
    try {
        const userId = req.user.id;
        const profileImage = req.file;


        const updatedUser = await userCollection.findByIdAndUpdate(
            { _id: userId }, 
            { profilePicture: profileImage.filename }, 
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Profile image updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile image' });
    }
}

const update = async(req,res) => {
    const data = req.body
    const userId = req.user.id;

    try {
        const updatedUser = await userCollection.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        updatedUser.password = null
        res.status(200).json({ message: 'User data updated successfully', updatedUser });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update user data' });
    }

}

const updatePassword = async(req,res) => {
    const {currentPassword, password} = req.body
    const userId = req.user.id;

    try {
        const user = await userCollection.findOne({_id: userId})

        if(!user){
            return res.status(404).json({ message: 'Invalid User' });
        }


        bcrypt.compare(currentPassword, user.password, async(err, result) => {
            if (result === false) {
                return res.status(200).json({ message: 'Invalid Password' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userCollection.findOneAndUpdate({ userId }, { $set: {password: hashedPassword} });
            return res.status(200).json({ message: 'Password updated successfully' });
    
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user data' });
    }
}

const userSearch = async (req, res) => {
    try {
      const query = req.query.query;
      // Check if the query string has a length greater than a certain threshold
      if (query.length >= 2) {
          // Perform a case-insensitive search for users whose first name contains the query string
          const users = await userCollection.find({
            firstName: { $regex: new RegExp(query, 'i') }
          });
          res.json(users);
      } else {
          // Return an empty array if the query length is less than the threshold
          res.json([]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
}

const getNotifications = async(req, res) => {
    const userId = req.user.id;
    try {
        const notifications = await userCollection.findOne({_id: userId},{notifications: 1})
        res.status(200).json({notifications})
    } catch (error) {
        console.log(error.message)
    }
}

const getOtherUserData = async (req,res) =>{
    const userId = req.query.id;
    try {
        const userData = await userCollection.findById(userId)
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
}

const followers = async(req,res) => {
    try {
        const userId = req.user.id;
        const userData = await userCollection.findOne({_id: userId},{password:0})
        .populate('followers', 'firstName lastName profilePicture _id')

        res.status(200).json(userData.followers);
        
    } catch (error) {
        console.log(error.message)
    }
}

const following = async(req,res) => {
    try {
        const userId = req.user.id;
        const userData = await userCollection.findOne({_id: userId},{password:0})
        .populate('following', 'firstName lastName profilePicture _id')

        res.status(200).json(userData.following);
        
    } catch (error) {
        console.log(error.message)
    }
}

const markAllAsRead = async(req,res) => {
    const userId = req.user.id;
    try {
        const user = await userCollection.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        user.notifications.forEach(notification => {
          notification.isRead = 'true';
        });
    
        await user.save();
        res.status(200).json({ message: 'All notifications marked as read' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update notifications', error: error.message });
      }
}

const chatUserSearch = async (req, res) => {
    try {
      const query = req.query.query;
    //   const user = await userCollection.findOne({_id: req.user.id},{_id: 1})

      const currentUserId = req.user.id  
        // Perform a case-insensitive search for users whose first name contains the query string
        const users = await userCollection.find({
          firstName: { $regex: new RegExp(query, 'i') }
        }).select('firstName lastName _id profilePicture email');
        // Get the current user's document to access the following list
        const currentUser = await userCollection.findById(currentUserId).select('following');
        const followingIds = currentUser.following.map(followingId => followingId.toString());
        // Filter the users to include only those who are in the following list
        const filteredUsers = users.filter(user => followingIds.includes(user._id.toString()));
        res.status(200).json(filteredUsers);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

const mediaUpload = async(req,res) => {
    res.json({ filePath: req.file.filename });
}


const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userCollection.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid User' });
      }
  
      forgetOtpToEmail(email);
      const token = jwt.sign({ forgetEmail: email }, process.env.SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ message: 'User Exist', token });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


const forgetPasswordOtp = async(req,res) => {

    const {enteredOtp, forgetToken} = req.body
    let forgetEmail

    try {
        jwt.verify(forgetToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
              console.error('Failed to verify token:', err.message);
            } else {
                forgetEmail = decoded.forgetEmail
            }
        });
        const sendOtp = await userCollection.findOne({email:forgetEmail},{otp:1,_id:0})


        if(!sendOtp){
            return res.status(410).json({ message: 'errorOtp' });
        }

        if (enteredOtp == sendOtp.otp) {            
            return res.status(201).json({message: 'OTP veryfied' });
        }
        else {
            return res.status(400).json({message: 'errorOtp' });
        }
    } 
    catch (error) {
        console.log(error.message);
    }

}

const forgetPasswordResendOtp = async(req,res) => {
    try {
        let forgetEmail;

        const { forgetToken } = req.body;

        jwt.verify(forgetToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error('Failed to verify token:', err.message);
                return res.status(400).json({ message: 'Invalid token' });
            } else {
                forgetEmail = decoded.forgetEmail;
            }
        });
        forgetOtpToEmail(forgetEmail);
        return res.status(200).json({ message: 'OTP resent successfully' });

    } 
    catch (error) {
        console.error('Error resending OTP:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const newPassword = async(req,res) => {
    const {password, forgetToken} = req.body
    try {
        jwt.verify(forgetToken, process.env.SECRET_KEY, async(err, decoded) => {
            if (err) {
              console.error('Failed to verify token:', err.message);
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                await userCollection.findOneAndUpdate({ email: decoded.forgetEmail }, { $set: {password: hashedPassword} });
                return res.status(200).json({ message: 'Password updated successfully' });
            }
        });
        
    } 
    catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    getUserData, getUserDetails, allFollowing, suggestFriends, postLength, updateProfileImage, 
    update, updatePassword, userSearch, getNotifications, getOtherUserData, followers, following,
    markAllAsRead, chatUserSearch, mediaUpload, forgetPassword, forgetPasswordOtp, forgetPasswordResendOtp,
    newPassword
}