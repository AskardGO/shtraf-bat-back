
import { ChatRepository } from "./ChatRepository";
import { FriendRepository } from "./FriendRepository";
import { MessageRepository } from "./MessageRepository";
import { UserRepository } from "./UserRepository";

export const chatRepo = new ChatRepository();
export const friendRepo = new FriendRepository();
export const messageRepo = new MessageRepository();
export const userRepo = new UserRepository();
