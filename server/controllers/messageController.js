const Message = require('../model/message')

const addMessage = async (req, res) => {

    const newMessage = new Message(req.body);

    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
}

const getMessage = async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      }).sort({ createdAt: -1 })
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
}



module.exports = {
    addMessage, getMessage
}