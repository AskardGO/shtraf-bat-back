import { FriendRepository } from "../repositories/FriendRepository";
import { ChatService } from "./ChatService";

export class FriendService {
    constructor(
        private friendRepo: FriendRepository,
        private chatService: ChatService
    ) {}

    async addFriend(userId: string, friendId: string) {
        console.log('FriendService.addFriend called with:', { userId, friendId });

        try {
            console.log('Adding friend for user:', userId, '-> friend:', friendId);
            await this.friendRepo.addFriend(userId, friendId);
            
            console.log('Adding friend for user:', friendId, '-> friend:', userId);
            await this.friendRepo.addFriend(friendId, userId);
            
            console.log('Both friends added successfully');
        } catch (error) {
            console.error('Error in addFriend:', error);
            throw error;
        }

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
