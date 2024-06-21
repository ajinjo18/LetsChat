const Conversation = require('../model/conversation')
const Message = require('../model/message')

const newConv = async (req, res) => {
  
  const { senderId, receiverId } = req.query;
  
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
  
    try {
      const savedConversation = await newConversation.save();
      // Now, retrieve the saved conversation and populate the members field
      const populatedConversation = await Conversation.findById(savedConversation._id)
        .populate("members", "_id firstName lastName profilePicture");
  
      res.status(200).json(populatedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
}


const convOfAUser = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate("members", "_id firstName lastName profilePicture isOnline")
      .sort({ updatedAt: -1 });

    // Fetch the last message for each conversation
    const conversationsWithLastMessage = await Promise.all(conversations.map(async (conversation) => {
      const lastMessage = await Message.findOne({ conversationId: conversation._id })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .exec();

      // Count unread messages in this conversation
      const unreadMessageCount = await Message.countDocuments({
        conversationId: conversation._id,
        sender: { $ne: req.params.userId }, // Sender is not equal to userId
        isRead: false
      });

      return {
        ...conversation.toObject(),
        lastMessage,
        unreadMessageCount // Add unread message count to conversation object
      };
    }));

    res.status(200).json(conversationsWithLastMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
    const result = await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.status(200).json({ message: "Messages marked as read", result });
  } catch (err) {
    res.status(500).json(err);
  }
};


const convIncludesTwoUserId = async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
}

module.exports = {
    newConv, convOfAUser, convIncludesTwoUserId, markMessagesAsRead
}