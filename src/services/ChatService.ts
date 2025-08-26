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
        return this.chatRepo.findByParticipant(userId);
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
        await this.chatRepo.update(chatId, { messages: chat.messages });

        return message;
    }

}

