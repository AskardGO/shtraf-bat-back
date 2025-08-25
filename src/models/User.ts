import { Schema, model, Document } from "mongoose";
import { randomUUID } from "node:crypto";

export interface IUser extends Document {
    uid: string;
    login: string;
    password: string;
    avatar: string | null;
    friends: string[];
    isOnline: boolean;
    lastSeen: Date;
    refreshToken?: string;
}

const UserSchema = new Schema<IUser>({
    uid: { type: String, default: randomUUID, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    friends: { type: [String], default: [] },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    refreshToken: { type: String, default: null }
});

export const UserModel = model<IUser>("User", UserSchema);
