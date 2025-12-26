import { messageModel } from "../models/message.model.js";
import { userModel } from "../models/user.model.js";

const createMessage = async (req, res, next) => {
    try {
        const { sender, receiver, content } = req.body;
        
        // Check if receiver exists
        const receiverExists = await userModel.findById(receiver);
        if (!receiverExists) {
            const err = new Error("Receiver not found");
            err.status = 404;
            return next(err);
        }

        // Create new message
        const newMessage = await messageModel.create({
            sender,
            receiver,
            content
        });

        return res.status(201).json({
            message: "Message created successfully",
            data: newMessage
        });
    } catch (error) {
        const err = new Error("Internal Server Error: " + error.message);
        err.status = 500;
        return next(err);
    }
}

// Get all messages (Sender or Receiver)
const getAllMessages = async (req, res,next) => {
    const { flag, sender, receiver } = req.body;
    try {
    if (flag === 'inbox') {
        // Fetch messages where the user is the receiver
        try {
         const messages = await messageModel.find({ receiver: receiver });
         return res.json({ message: "Inbox messages for " + receiver, data: messages });
        } catch (error) {
         const err = new Error("Internal Server Error" );
         err.status = 500;
         return next(err);
        }
    } else if (flag === 'outbox') {
        // Fetch messages where the user is the sender
        try {
         const messages = await messageModel.find({ sender: sender });
         return res.json({ message: "Outbox messages for " + sender, data: messages });
        } catch (error) {
         const err = new Error("Internal Server Error" );
         err.status = 500;
         return next(err);
        }
    }
    } catch (error) {
    const err = new Error("Internal Server Error" );
    err.status = 500;
    return next(err);
    }

}
const getMessage = async (req, res,next) => {
    // res.send('Get single message');
    const { messageID } = req.params;
    try {
        const populateConfig = [
            { path: 'sender', select: 'userName email -_id' },
            { path: 'receiver', select: 'userName email -_id' }
        ];
        const message = await messageModel.findById(messageID).populate(populateConfig);
        if(!message){
            const err = new Error("Message not found" + err.message);
            err.status = 404;
            return next(err);
        }
        return res.json({message: "Get single message", data: message});
    } catch (error) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        return next(err);
    }
}
const deleteMessage = async (req, res,next) => {
    // res.send('Message deleted');
    try {
        return res.json({message: "Message deleted"});
    } catch (error) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        return next(err);
    }
}
export { createMessage, getAllMessages, getMessage, deleteMessage };