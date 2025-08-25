import { UserRepository } from "../repositories/UserRepository";
import { hashPassword, comparePassword } from "../utils/hash";
import { FastifyInstance } from "fastify";
import { signJwt } from "../utils/jwt";

export class AuthService {
    constructor(private userRepo: UserRepository, private app: FastifyInstance) {}

    async register(login: string, password: string) {
        const existing = await this.userRepo.findByLogin(login);
        if (existing) throw new Error("User already exists");

        const hashed = await hashPassword(password);
        const user = await this.userRepo.create({ login, password: hashed });

        return {
            uid: user.uid,
            login: user.login,
            avatar: user.avatar,
            token: signJwt(this.app, { uid: user.uid, login: user.login })
        };
    }

    async login(login: string, password: string) {
        const user = await this.userRepo.findByLogin(login);
        if (!user) throw new Error("User not found");

        const valid = await comparePassword(password, user.password);
        if (!valid) throw new Error("Invalid password");

        return {
            uid: user.uid,
            login: user.login,
            avatar: user.avatar,
            token: signJwt(this.app, { uid: user.uid, login: user.login })
        };
    }

    async logout(uid: string) {
        await this.userRepo.updateStatus(uid, false);
        return { message: "Logged out" };
    }

    async getStatus(uid: string) {
        const user = await this.userRepo.findById(uid);
        if (!user) throw new Error("User not found");
        return { uid: user.uid, isOnline: user.isOnline, lastSeen: user.lastSeen };
    }

}
