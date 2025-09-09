import { Server, Socket } from "socket.io";
import { UserRepository } from "../repositories/UserRepository";
import { ChatRepository } from "../repositories/ChatRepository";
import { MessageRepository } from "../repositories/MessageRepository";

interface WSClient {
    uid: string;
    socketId: string;
    isActive: boolean;
    lastActivity: Date;
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

            if (!uid) {
                socket.disconnect(true);
                return;
            }

            this.clients = this.clients.filter(c => c.uid !== uid);
            this.clients.push({
                uid,
                socketId: socket.id,
                isActive: true,
                lastActivity: new Date()
            });
            await this.userRepo.updateStatus(uid, true);

            socket.on("message", async (data: any) => {
                try {
                    await this.handleMessage(socket, uid, data);
                } catch (err) {
                    console.error("WS message error:", err);
                }
            });

            socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
                await this.broadcastTyping(uid, data.chatId, data.isTyping, io);
            });

            socket.on("presence", async (data: { isActive: boolean; timestamp: Date }) => {
                await this.handlePresenceUpdate(socket, uid, data.isActive, data.timestamp, io);
            });

            socket.on("disconnect", async () => {
                this.clients = this.clients.filter(c => c.socketId !== socket.id);
                await this.userRepo.updateStatus(uid, false);

                await this.broadcastPresenceUpdate(uid, false, new Date(), io);
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
                if (client.uid === uid) {
                    socket.emit("message", { chatId, message });
                } else {
                    socket.broadcast.to(client.socketId).emit("message", { chatId, message });
                }
            }
        });
    }

    private async handlePresenceUpdate(socket: Socket, uid: string, isActive: boolean, timestamp: Date, io: Server) {
        const client = this.clients.find(c => c.uid === uid);
        if (client) {
            client.isActive = isActive;
            client.lastActivity = timestamp;
        }

        await this.userRepo.updateStatus(uid, isActive);

        await this.broadcastPresenceUpdate(uid, isActive, timestamp, io);
    }

    private async broadcastPresenceUpdate(userId: string, isOnline: boolean, lastSeen: Date, io: Server) {
        this.clients.forEach(client => {
            if (client.uid !== userId) {
                io.to(client.socketId).emit("presence", {
                    userId,
                    isOnline,
                    lastSeen
                });
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
