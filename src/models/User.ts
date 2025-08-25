import { Schema, model, Document } from "mongoose";
import {randomUUID} from "node:crypto";

export interface IUser extends Document {
    uid: string;
    login: string;
    password: string;
    avatar: string;
}

const UserSchema = new Schema<IUser>({
    uid: { type: String, default: randomUUID, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://i.pravatar.cc/150?img=3" }
});

export const UserModel = model<IUser>("User", UserSchema);
