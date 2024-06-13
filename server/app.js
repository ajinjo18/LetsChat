const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
require('dotenv').config()

const Message = require('./model/message')
const postCollection = require('./model/post')
const userCollection = require('./model/users')
const Conversation = require('./model/conversation')

const userRouter = require('./routes/userRouter')
const admin = require('./routes/adminRoutes')
const conv = require('./routes/conversationRoutes')
const message = require('./routes/messageRoutes')
const refreshToken = require('./routes/tokenRoutes')

const app = express()

const server = http.createServer(app)

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
}))

const io = socketio(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true
    }
});

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/user', userRouter)
app.use('/token', refreshToken)
app.use('/admin', admin)
app.use('/conversations', conv)
app.use('/messages', message)

const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('----------------------')
    console.log('A user connected');
    console.log('----------------------')

    // Store the user ID and socket ID mapping
    socket.on('setUserId', async({userId}) => {
      userSocketMap[userId] = socket.id;
      await userCollection.findByIdAndUpdate(userId, { isOnline: true });
    });

    socket.on('user blocked',(data)=>{
        const receiverSocketId = userSocketMap[data.userId];
        io.to(receiverSocketId).emit('user blocked')
    })


    socket.on('start call', ({ roomId, callerId, receiverId, user }) => {
        const receiverSocketId = userSocketMap[receiverId];
        io.to(receiverSocketId).emit('incoming call', { roomId, callerId, user });
    });




    socket.on('signal', (data) => {
        console.log('data', data)
        const { signal, to } = data;
        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('signal', { signal, from: socket.id });
        }
    });

    socket.on('endCall', (data) => {
        const { to } = data;
        const receiverSocketId = userSocketMap[to];
        console.log('End call received:', data);
        io.to(receiverSocketId).emit('endCall');
      });




    socket.on('sendMessage', async({ sender, receiver, message }) => {
        console.log('sender, receiver, message', sender, receiver, message);
        console.log('userSocketMap', userSocketMap)

        const newMessage = new Message(message);

        const savedMessage = await newMessage.save();

        console.log('conversationId', message.conversationId)

        await Conversation.findOneAndUpdate(
            { _id: message.conversationId },
            { updatedAt: new Date() }
        );

        // Get the receiver's socket ID from the mapping
        const receiverSocketId = userSocketMap[receiver];
        if (receiverSocketId) {

          const data = await userCollection.findOne({_id: message.sender})

          
          const messageData = {
            text: message.text,
            isLink: message.isLink ? true : false,
            conversationId: message.conversationId,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePicture: data.profilePicture,
            sender: message.sender,
            date: new Date(),
            isRead: false
          }

          io.to(receiverSocketId).emit('receiveMessage', { sender, message });
          io.to(receiverSocketId).emit('receiveNotification', { message: messageData });
        } else {
          console.log('Receiver socket ID not found');
        }
    });

    
    socket.on('typingStatus',({sender, receiver, text}) => {
        console.log('typingStatus',sender, receiver)
        const receiverSocketId = userSocketMap[receiver];
        console.log('receiverSocketIdiiii', receiverSocketId)
        if(receiverSocketId){
            if(text !== ''){
                io.to(receiverSocketId).emit('receivedTypingStatus',{sender, receiver});
            }
            else{
                io.to(receiverSocketId).emit('receivedTypingStatus',{data:''});
            }
        }else {
            console.log('Receiver socket ID not found');
        }
    })

    socket.on('likePost', async({ id, userId }) => {
        try {
            const post = await postCollection.findById(id);

            const updatedPost = await postCollection.findById(id)
            .populate('userId', 'firstName lastName profilePicture')
            .exec();
    
            if (!post.likes.includes(userId)) {
                await postCollection.findByIdAndUpdate(id, { $push: { likes: userId } });

                const userData = await userCollection.findById(userId)                

                const notification = {
                    type: 'like',
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    profilePicture: userData.profilePicture,
                    userId: userId,
                    postId: id,
                    images: updatedPost.images[0],
                    isRead: false
                }

                await userCollection.findByIdAndUpdate(updatedPost.userId._id, { $push: { notifications: notification } });

                const receiverSocketId = userSocketMap[updatedPost.userId._id];
                io.to(receiverSocketId).emit('notification', { notification:'liked post' });
                
            } else {
                console.log(`Post ${id} unliked by user ${userId}`);
                await postCollection.findByIdAndUpdate(id, { $pull: { likes: userId } });
                const result = await userCollection.findByIdAndUpdate(
                    updatedPost.userId._id,
                    {
                      $pull: {
                        notifications: {
                          postId: { $eq: id },
                          userId: { $eq: userId },
                        },
                      },
                    },
                    { new: true }
                  ); 
                  const receiverSocketId = userSocketMap[updatedPost.userId._id];
                  io.to(receiverSocketId).emit('notification', { notification:'unliked post' });

                  if (!result) {
                    throw new Error('User or notification not found');
                  }
                //   const updatedPost = await postCollection.findById(id);
                // return res.status(200).json({ message: 'Post Unliked', updatedPost });
            }
            
        } catch (error) {
            console.error(error.message);
            // return res.status(500).json({ message: 'Server Error' });
        }
        
    });

    socket.on('commentSubmit', async({ postId, text, userId }) => {
        // Process comment submission
        try {
            const post = await postCollection.findById(postId)
            .populate('userId', 'firstName lastName profilePicture _id')
            .exec();

            const userData = await userCollection.findById(userId) 

            const newComment = {
              text,
              user: userId
            };
        
            post.comments.push(newComment);
            await post.save();

            const notification = {
                type: 'comment',
                firstName: userData.firstName,
                lastName: userData.lastName,
                profilePicture: userData.profilePicture,
                userId: userId,
                postId: postId,
                images: post.images[0],
                isRead: false
            }

            await userCollection.findByIdAndUpdate(post.userId._id, { $push: { notifications: notification } });

            // Emit event to notify clients about successful submission
            const receiverSocketId = userSocketMap[post.userId._id];
            io.to(receiverSocketId).emit('notification',{notification:'comment added'});
        
            // res.status(201).json(newComment);
        } catch (error) {
        console.error('Error:', error);
        // res.status(500).json({ message: 'Server Error' });
        }
        
    });

    // Handle reply submission
    socket.on('replySubmit', async({ postId, commentId, text, userId }) => {
        // Process reply submission
        try {
            const post = await postCollection.findById(postId);
        
            const comment = post.comments.id(commentId);
        
            comment.replies.push({ text, user: userId });

            const userData = await userCollection.findById(userId) 

            const notification = {
                type: 'reply',
                firstName: userData.firstName,
                lastName: userData.lastName,
                commentId: commentId,
                profilePicture: userData.profilePicture,
                userId: userId,
                postId: postId,
                images: post.images[0],
                isRead: false
            }
        
            await post.save();
            await userCollection.findByIdAndUpdate(post.userId, { $push: { notifications: notification } });


            const receiverSocketId = userSocketMap[comment.user];

            io.to(receiverSocketId).emit('notification',{notification:'replySubmitted'});

        
            // res.status(201).json(post);
        } catch (error) {
            console.error('Error:', error);
            // res.status(500).json({ message: 'Server Error' });
        }
        // Emit event to notify clients about successful submission
    });

    socket.on('followUser', async ({ userId, id }) => {
        try {        
            if (!userId || !id) {
                console.log('Both userId and id are required. 11')
                // return res.status(400).json({ error: 'Both userId and id are required.' });
                return
            }
        
            // Find the user who is sending the follow request
            const currentUser = await userCollection.findById(userId);
            if (!currentUser) {
                // return res.status(404).json({ error: 'User not found.' });
                console.log('User not found.')
                return
            }
        
            // Find the user to be followed
            const userToFollow = await userCollection.findById(id);
            if (!userToFollow) {
                // return res.status(404).json({ error: 'User to follow not found.' });
                console.log('User to follow not found.')
                return
            }
        
            // Check if the user is already being followed
            if (currentUser.following.includes(id)) {
                // return res.status(400).json({ error: 'You are already following this user.' });
                console.log('You are already following this user.')
                return
            }
        
            // Update the currentUser's following list
            currentUser.following.push(id);
            await currentUser.save();
        
            // Update the userToFollow's followers list
            userToFollow.followers.push(userId);
            await userToFollow.save();

            const notification = {
                type: 'follow',
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                profilePicture: currentUser.profilePicture,
                userId: userId,
                isRead: false
            }

            console.log('notification', notification)
            await userCollection.findByIdAndUpdate(id, { $push: { notifications: notification } });
            
            const receiverSocketId = userSocketMap[id];
            io.to(receiverSocketId).emit('notification', { notification: 'followUserResponse' });
        
            // res.status(200).json({ message: 'Successfully followed user.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })

    socket.on('unfollowUser', async ({ userId, id }) => {
        console.log('2222', userId, id)
        try {
            const unfollowedUserId = id;
    
            if (!userId || !id) {
                console.log('Both userId and id are required 22.')
                return
                // return res.status(400).json({ error: 'Both userId and id are required.' });
            }
    
            // Find the current user who wants to unfollow
            const currentUser = await userCollection.findById(userId);
            if (!currentUser) {
                console.log('User not found.')
                return
                // return res.status(404).json({ error: 'User not found.' });
            }
    
            // Find the user to be unfollowed
            const userToUnfollow = await userCollection.findById(unfollowedUserId);
            if (!userToUnfollow) {
                console.log('User to unfollow not found.')
                return
                // return res.status(404).json({ error: 'User to unfollow not found.' });
            }
    
            // Check if the current user is already not following the user
            if (!currentUser.following.includes(unfollowedUserId)) {
                console.log('You are not following this user.')
                return
                // return res.status(400).json({ error: 'You are not following this user.' });
            }
    
            // Remove the unfollowed user from the current user's following list
            currentUser.following = currentUser.following.filter(id => id.toString() !== unfollowedUserId);
            await currentUser.save();
    
            // Remove the current user from the unfollowed user's followers list
            userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);
            await userToUnfollow.save();

            const result = await userCollection.findByIdAndUpdate(
                unfollowedUserId,
                {
                  $pull: {
                    notifications: {
                        type: {$eq:'follow'},
                        userId: { $eq: userId },
                    },
                  },
                },
                { new: true }
            ); 
            const receiverSocketId = userSocketMap[unfollowedUserId];
            io.to(receiverSocketId).emit('notification', { notification: 'unfollowUserResponse' })
            // res.status(200).json({ message: 'Successfully unfollowed user.' });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            // res.status(500).json({ error: 'Internal server error' });
        }

    })

    socket.on('removeFollower', async ({ userId, followerId }) => {
        console.log('Removing follower:', userId, followerId);
        try {
            if (!userId || !followerId) {
                console.log('Both userId and followerId are required.');
                return;
            }
    
            // Find the current user
            const currentUser = await userCollection.findById(userId);
            if (!currentUser) {
                console.log('Current user not found.');
                return;
            }
    
            // Find the follower user
            const followerUser = await userCollection.findById(followerId);
            if (!followerUser) {
                console.log('Follower user not found.');
                return;
            }
    
            // Check if the follower user is in the followers list
            if (!currentUser.followers.includes(followerId)) {
                console.log('This user is not your follower.');
                return;
            }
    
            // Remove the follower user from the current user's followers list
            currentUser.followers = currentUser.followers.filter(id => id.toString() !== followerId);
            await currentUser.save();
    
            // Remove the current user from the follower user's following list
            followerUser.following = followerUser.following.filter(id => id.toString() !== userId);
            await followerUser.save();
    
            // Optionally, remove follow notifications
            const result = await userCollection.findByIdAndUpdate(
                followerId,
                {
                    $pull: {
                        notifications: {
                            type: { $eq: 'follow' },
                            userId: { $eq: userId },
                        },
                    },
                },
                { new: true }
            );
    
            const receiverSocketId = userSocketMap[followerId];
            io.to(receiverSocketId).emit('notification', { notification: 'Follower removed successfully.' });
    
            console.log('Follower removed successfully.');
        } catch (error) {
            console.error('Error removing follower:', error);
        }
    });
    

    socket.on("disconnect", async() => {
        console.log("A user disconnected!");
        // Find and remove the disconnected user's entry from the map
        const disconnectedUser = Object.keys(userSocketMap).find(
            (userId) => userSocketMap[userId] === socket.id
        );
        if (disconnectedUser) {
            delete userSocketMap[disconnectedUser];
            await userCollection.findByIdAndUpdate(disconnectedUser, { isOnline: false })
            console.log(`User ${disconnectedUser} disconnected`);
        }
    });
      
});

function getOtherUserInRoom(roomId, socketId) {
    const clients = io.sockets.adapter.rooms.get(roomId);
    if (clients) {
      for (const clientId of clients) {
        if (clientId !== socketId) {
          return clientId;
        }
      }
    }
    return null;
  }