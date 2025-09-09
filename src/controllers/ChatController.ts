import { FastifyRequest, FastifyReply } from "fastify";
import {chatService} from "../services";

export class ChatController {

    createChat = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { friendId } = req.body as { friendId: string };
            const chat = await chatService.createChat(userJwt.uid, friendId);

            reply.send(chat);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    archiveChat = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { chatId } = req.params as { chatId: string };
            const chat = await chatService.archiveChat(chatId);

            if (!chat) return reply.status(404).send({ error: "Chat not found" });
            reply.send(chat);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    restoreChat = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { friendId } = req.body as { friendId: string };
            const chat = await chatService.restoreChatBetween(userJwt.uid, friendId);

            if (!chat) return reply.status(404).send({ error: "Chat not found" });
            reply.send(chat);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    getChatBetween = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { friendId } = req.params as { friendId: string };
            const chat = await chatService.getChatBetween(userJwt.uid, friendId);

            if (!chat) return reply.status(404).send({ error: "Chat not found" });
            reply.send(chat);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    getMyChats = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const chats = await chatService.getUserChats(userJwt.uid);
            reply.send(chats);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    sendMessage = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { chatId, text } = req.body as { chatId: string; text: string };
            if (!chatId || !text) return reply.status(400).send({ error: "chatId and text are required" });

            const message = await chatService.sendMessage(chatId, userJwt.uid, text);
            reply.send({ message });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    getChatMessages = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { chatId } = req.params as { chatId: string };
            const { limit = 50, offset = 0 } = req.query as { limit?: number; offset?: number };
            const messages = await chatService.getChatMessages(chatId, userJwt.uid, Number(limit), Number(offset));
            reply.send(messages);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

}
