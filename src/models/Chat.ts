import { Schema, model, Document } from "mongoose";
import { randomUUID } from "node:crypto";

export interface IChat extends Document {
    id: string;
    participants: string[];
    messages: string[];
    createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
    id: { type: String, default: randomUUID, unique: true },
    participants: { type: [String], required: true },
    messages: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export const ChatModel = model<IChat>("Chat", ChatSchema);
