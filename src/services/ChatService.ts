import {ChatRepository} from "../repositories/ChatRepository";
import {MessageRepository} from "../repositories/MessageRepository";

export class ChatService {
    constructor(
        private chatRepo: ChatRepository,
        private messageRepo: MessageRepository
) {}

    async createChat(userId: string, friendId: string) {
        const existing = await this.chatRepo.findChatBetween(userId, friendId);
        if (existing) return existing;

        return this.chatRepo.create({ participants: [userId, friendId], messages: [] });
    }

    async archiveChat(chatId: string) {
        return this.chatRepo.archiveChat(chatId);
    }

    async restoreChatBetween(userId: string, friendId: string) {
        const chat = await this.chatRepo.findChatBetween(userId, friendId);
        if (!chat) return null;
        return this.chatRepo.restoreChat(chat.id);
    }

    async getChatBetween(userAId: string, userBId: string) {
        return this.chatRepo.findChatBetween(userAId, userBId);
    }

    async getChatById(chatId: string) {
        return this.chatRepo.findById(chatId);
    }

    async getUserChats(userId: string) {
        try {
            const chats = await this.chatRepo.findByParticipant(userId);
            return chats.map(chat => chat.toObject());
        } catch (error) {
            console.error('Error in getUserChats:', error);
            throw error;
        }
    }

    async sendMessage(chatId: string, senderId: string, text: string) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) throw new Error("Chat not found");

        if (!chat.participants.includes(senderId)) {
            throw new Error("Sender is not part of this chat");
        }

        const message = await this.messageRepo.create({
            chatId,
            senderId,
            text
        });

        chat.messages.push(message.id);
        await this.chatRepo.update(chatId, { 
            messages: chat.messages
        });

        return message;
    }

    async getChatMessages(chatId: string, userId: string, limit: number = 50, offset: number = 0) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) throw new Error("Chat not found");

        if (!chat.participants.includes(userId)) {
            throw new Error("User is not part of this chat");
        }

        const messages = await this.messageRepo.findByChatIdPaginated(chatId, limit, offset);
        return messages;
    }

}

