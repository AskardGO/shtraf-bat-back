import { ChatModel } from "../models/Chat";

export class ChatRepository {
    async findChatBetween(uid1: string, uid2: string) {
        return ChatModel.findOne({ participants: { $all: [uid1, uid2] } });
    }

    async create(data: { participants: string[], messages?: string[] }) {
        const chat = new ChatModel(data);
        return chat.save();
    }

    async update(chatId: string, data: any) {
        return ChatModel.findOneAndUpdate({ id: chatId }, data, { new: true });
    }

    async findById(chatId: string) {
        return ChatModel.findOne({ id: chatId });
    }

    async archiveChat(chatId: string) {
        return ChatModel.findOneAndUpdate({ id: chatId }, { archivedAt: new Date() }, { new: true });
    }

    async restoreChat(chatId: string) {
        return ChatModel.findOneAndUpdate({ id: chatId }, { archivedAt: null }, { new: true });
    }

    async findByParticipant(userId: string) {
        return ChatModel.find({ participants: userId });
    }

}
