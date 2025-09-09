import { MessageModel, IMessage } from "../models/Message";
import { Types } from "mongoose";

export class MessageRepository {
    async create(data: { chatId: string; senderId: string; text: string }): Promise<IMessage> {
        const message = new MessageModel(data);
        return message.save();
    }

    async findById(id: string | Types.ObjectId): Promise<IMessage | null> {
        return MessageModel.findOne({ id: id });
    }

    async findByChatId(chatId: string): Promise<IMessage[]> {
        return MessageModel.find({ chatId }).sort({ createdAt: 1 });
    }

    async findByChatIdPaginated(chatId: string, limit: number = 50, offset: number = 0): Promise<IMessage[]> {
        return MessageModel.find({ chatId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .then(messages => messages.reverse());
    }

    async update(id: string | Types.ObjectId, data: Partial<IMessage>): Promise<IMessage | null> {
        return MessageModel.findOneAndUpdate({ id: id }, data, { new: true });
    }

    async delete(id: string | Types.ObjectId): Promise<IMessage | null> {
        return MessageModel.findOneAndDelete({ id: id });
    }
}
