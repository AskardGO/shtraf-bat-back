import { FriendRepository } from "../repositories/FriendRepository";
import { ChatService } from "./ChatService";

export class FriendService {
    constructor(
        private friendRepo: FriendRepository,
        private chatService: ChatService
    ) {}

    async addFriend(userId: string, friendId: string) {

        await this.friendRepo.addFriend(userId, friendId);
        await this.friendRepo.addFriend(friendId, userId);

        let chat = await this.chatService.getChatBetween(userId, friendId);

        if (chat) {
            await this.chatService.restoreChatBetween(userId, friendId);
        } else {
            chat = await this.chatService.createChat(userId, friendId);
        }

        return chat;
    }

    async removeFriend(userId: string, friendId: string) {

        await this.friendRepo.removeFriend(userId, friendId);
        await this.friendRepo.removeFriend(friendId, userId);

        const chat = await this.chatService.getChatBetween(userId, friendId);
        if (chat) {
            await this.chatService.archiveChat(chat.id);
        }

        return { message: "Friend removed and chat archived" };
    }

    async listFriends(userId: string) {
        return this.friendRepo.getFriends(userId);
    }
}
