import { UserRepository } from "../repositories/UserRepository";
import { hashPassword, comparePassword } from "../utils/hash";
import { FastifyInstance } from "fastify";
import { signJwt } from "../utils/jwt";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { configService } from "../config/ConfigService";

export class AuthService {
    constructor(private userRepo: UserRepository, private app: FastifyInstance) {}

    private async hashToken(token: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(token, salt);
    }

    private generateRefreshToken() {
        return crypto.randomBytes(64).toString("hex");
    }

    private generateAccessToken(user: { uid: string; login: string }) {
        return signJwt(this.app, { uid: user.uid, login: user.login }, configService.getAccessTokenExpires());
    }

    async register(login: string, password: string) {
        const existing = await this.userRepo.findByLogin(login);
        if (existing) throw new Error("User already exists");

        const hashed = await hashPassword(password);
        const user = await this.userRepo.create({ login, password: hashed });

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();
        const hashedRefresh = await this.hashToken(refreshToken);

        await this.userRepo.setRefreshToken(user.uid, hashedRefresh);

        return {
            uid: user.uid,
            login: user.login,
            avatar: user.avatar,
            accessToken,
            refreshToken
        };
    }

    async login(login: string, password: string) {
        const user = await this.userRepo.findByLogin(login);
        if (!user) throw new Error("User not found");

        const valid = await comparePassword(password, user.password);
        if (!valid) throw new Error("Invalid password");

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();
        const hashedRefresh = await this.hashToken(refreshToken);

        await this.userRepo.setRefreshToken(user.uid, hashedRefresh);

        return {
            uid: user.uid,
            login: user.login,
            avatar: user.avatar,
            accessToken,
            refreshToken
        };
    }

    async logout(uid: string) {
        await this.userRepo.setRefreshToken(uid, null);
        await this.userRepo.updateStatus(uid, false);
        return { message: "Logged out" };
    }

    async refreshToken(oldToken: string) {
        const users = await this.userRepo.findAll();
        for (const user of users) {
            if (!user.refreshToken) continue;
            const valid = await bcrypt.compare(oldToken, user.refreshToken);
            if (valid) {
                const accessToken = this.generateAccessToken(user);
                const refreshToken = this.generateRefreshToken();
                const hashedRefresh = await this.hashToken(refreshToken);

                await this.userRepo.setRefreshToken(user.uid, hashedRefresh);

                return { accessToken, refreshToken };
            }
        }
        throw new Error("Invalid refresh token");
    }
}
