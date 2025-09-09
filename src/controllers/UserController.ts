import { FastifyRequest, FastifyReply } from "fastify";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
    constructor(private userRepo: UserRepository) {}

    getStatus = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { uid } = req.params as any;
            const user = await this.userRepo.findByUid(uid);
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
            const user = await this.userRepo.findByUid(uid);
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

            const user = await this.userRepo.findByUid(userJwt.uid);
            if (!user) return reply.status(404).send({ error: "User not found" });

            reply.send({
                uid: user.uid,
                login: user.login,
                avatar: user.avatar,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                displayedName: user.displayedName,
                displayedNameChanges: user.displayedNameChanges,
            });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    updateDisplayedName = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userJwt = req.user as any;
            if (!userJwt) return reply.status(401).send({ error: "Unauthorized" });

            const { displayedName } = req.body as any;
            if (!displayedName || displayedName.trim().length === 0) {
                return reply.status(400).send({ error: "displayedName is required" });
            }

            if (displayedName.trim().length > 50) {
                return reply.status(400).send({ error: "displayedName must be 50 characters or less" });
            }

            const user = await this.userRepo.findByUid(userJwt.uid);
            if (!user)
              return reply.status(404).send({ error: "User not found" });

            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            
            const recentChanges = user.displayedNameChanges.filter(change => change > oneDayAgo);
            
            if (recentChanges.length >= 2) {
                const oldestRecentChange = recentChanges[0];
                const timeUntilNextChange = new Date(oldestRecentChange.getTime() + 24 * 60 * 60 * 1000);
                
                return reply.status(429).send({ 
                    error: "You can only change your displayed name 2 times per day",
                    nextChangeAvailable: timeUntilNextChange
                });
            }

            user.displayedName = displayedName.trim();
            user.displayedNameChanges.push(now);
            
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            user.displayedNameChanges = user.displayedNameChanges.filter(change => change > thirtyDaysAgo);
            
            await user.save();

            reply.send({
                uid: user.uid,
                login: user.login,
                avatar: user.avatar,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                displayedName: user.displayedName,
                displayedNameChanges: user.displayedNameChanges,
            });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };
}
