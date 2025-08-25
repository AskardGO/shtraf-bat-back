import { FastifyRequest, FastifyReply } from "fastify";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
    constructor(private userRepo: UserRepository) {}

    getStatus = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { uid } = req.params as any;
            const user = await this.userRepo.findById(uid);
            if (!user) return reply.status(404).send({ error: "User not found" });

            reply.send({
                uid: user.uid,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
            });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    getProfile = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { uid } = req.params as any;
            const user = await this.userRepo.findById(uid);
            if (!user) return reply.status(404).send({ error: "User not found" });

            reply.send({
                uid: user.uid,
                login: user.login,
                avatar: user.avatar,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
            });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    getMe = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const user = await this.userRepo.findById(userJwt.uid);
            if (!user) return reply.status(404).send({ error: "User not found" });

            reply.send({
                uid: user.uid,
                login: user.login,
                avatar: user.avatar,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
            });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

}
