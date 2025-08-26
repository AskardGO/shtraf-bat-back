import { chatRepo, messageRepo, userRepo, friendRepo } from "../repositories";
import { ChatService } from "./ChatService";
import { FriendService } from "./FriendService";
import { WebSocketService } from "./WebSocketService";
import {AuthService} from "./AuthService";

export const chatService = new ChatService(chatRepo, messageRepo);
export const friendService = new FriendService(friendRepo, chatService);
export const authService = new AuthService(userRepo);
export const wsService = new WebSocketService(userRepo, chatRepo, messageRepo);
