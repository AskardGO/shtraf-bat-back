import {ChatModel} from "../models/Chat";


export class ChatRepository {
    async findChatBetween(uid1: string, uid2: string) {
        return ChatModel.findOne({ participants: { $all: [uid1, uid2] } });
    }

    async create(data: { participants: string[], messages?: any[] }) {
        const chat = new ChatModel(data);
        return chat.save();
    }
}
