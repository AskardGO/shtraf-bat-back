import { Server, Socket } from "socket.io";
import { UserRepository } from "../repositories/UserRepository";
import { ChatRepository } from "../repositories/ChatRepository";
import { MessageRepository } from "../repositories/MessageRepository";

interface WSClient {
    uid: string;
    socketId: string;
}

export class WebSocketService {
    private clients: WSClient[] = [];

    constructor(
        private userRepo: UserRepository,
        private chatRepo: ChatRepository,
        private messageRepo: MessageRepository
    ) {}

    async register(io: Server) {
        io.on("connection", async (socket: Socket) => {
            const { uid } = socket.handshake.auth;
            console.log("🔌 Socket connected", socket.id, uid);

            if (!uid) {
                console.log("❌ No UID, disconnecting", socket.id);
                socket.disconnect(true);
                return;
            }

            this.clients.push({ uid, socketId: socket.id });
            await this.userRepo.updateStatus(uid, true);
            console.log(`✅ User ${uid} is online`);

            socket.on("message", async (data: any) => {
                console.log(`📨 Message from ${uid}:`, data);
                try {
                    await this.handleMessage(socket, uid, data);
                } catch (err) {
                    console.error("WS message error:", err);
                }
            });

            socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
                console.log(`⌨️ Typing from ${uid} in chat ${data.chatId}: ${data.isTyping}`);
                await this.broadcastTyping(uid, data.chatId, data.isTyping, io);
            });

            socket.on("disconnect", async () => {
                this.clients = this.clients.filter(c => c.socketId !== socket.id);
                await this.userRepo.updateStatus(uid, false);
                console.log(`❌ User ${uid} disconnected`);
            });
        });

    }

    private async handleMessage(socket: Socket, uid: string, data: any) {
        const { chatId, text } = data;
        const chat = await this.chatRepo.findById(chatId);
        if (!chat || !chat.participants.includes(uid)) {
            socket.emit("error", { message: "Unauthorized or chat not found" });
            return;
        }

        const message = await this.messageRepo.create({
            chatId,
            senderId: uid,
            text,
        });

        chat.messages.push(message.id);
        await this.chatRepo.update(chatId, chat);

        chat.participants.forEach(participantId => {
            const client = this.clients.find(c => c.uid === participantId);
            if (client) {
                socket.to(client.socketId).emit("message", { chatId, message });
            }
        });
    }

    private async broadcastTyping(senderId: string, chatId: string, isTyping: boolean, io: Server) {
        const chat = await this.chatRepo.findById(chatId);
        if (!chat) return;

        chat.participants.forEach(uid => {
            if (uid !== senderId) {
                const client = this.clients.find(c => c.uid === uid);
                if (client) io.to(client.socketId).emit("typing", { chatId, userId: senderId, isTyping });
            }
        });
    }
}
