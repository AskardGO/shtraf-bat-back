import { Schema, model, Document } from "mongoose";
import { randomUUID } from "node:crypto";

export interface IMessage extends Document {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    id: { type: String, default: randomUUID, unique: true },
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const MessageModel = model<IMessage>("Message", MessageSchema);
