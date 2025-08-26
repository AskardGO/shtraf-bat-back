import { MessageModel, IMessage } from "../models/Message";
import { Types } from "mongoose";

export class MessageRepository {
    async create(data: { chatId: string; senderId: string; text: string }): Promise<IMessage> {
        const message = new MessageModel(data);
        return message.save();
    }

    async findById(id: string | Types.ObjectId): Promise<IMessage | null> {
        return MessageModel.findById(id);
    }

    async findByChatId(chatId: string): Promise<IMessage[]> {
        return MessageModel.find({ chatId }).sort({ createdAt: 1 });
    }

    async update(id: string | Types.ObjectId, data: Partial<IMessage>): Promise<IMessage | null> {
        return MessageModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string | Types.ObjectId): Promise<IMessage | null> {
        return MessageModel.findByIdAndDelete(id);
    }
}
