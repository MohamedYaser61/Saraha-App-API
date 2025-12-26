/**
 * Message Model
 * content - sender - receiver - timestamp
 * 
 * Message Controller
 * createMessage
 * getMessage
 * deleteMessage
 * getAllMessages
 */ 

import mongoose from "mongoose";
import { Schema } from "mongoose";
const messageSchema = new Schema(
  {
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"],
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver is required"],
    },
    },
    { timestamps: true }
);

export const messageModel = mongoose.model("Message", messageSchema);