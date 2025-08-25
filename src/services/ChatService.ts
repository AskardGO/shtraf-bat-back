import {ChatRepository} from "../repositories/ChatRepository";
import {IUser} from "../models/User";

export class ChatService {
    constructor(private chatRepo: ChatRepository) {
    }

    async createChat(userA: IUser, userB: IUser) {

        const existingChat = await this.chatRepo.findChatBetween(userA.uid, userB.uid);
        if (existingChat) return existingChat;

        const chat = await this.chatRepo.create({
            participants: [userA.uid, userB.uid],
            messages: []
        });
        return chat;
    }
}
