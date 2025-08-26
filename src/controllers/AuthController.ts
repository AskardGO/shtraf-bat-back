import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/AuthService";
import { configService } from "../config/ConfigService";

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { login, password } = req.body as { login: string; password: string };
            const { accessToken, refreshToken, ...user } = await this.authService.register(login, password);

            reply.setCookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/auth",
                maxAge: configService.getRefreshTokenExpiresInSeconds()
            });

            reply.send({ ...user, accessToken, refreshToken });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    login = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { login, password } = req.body as { login: string; password: string };
            const { accessToken, refreshToken, ...user } = await this.authService.login(login, password);

            reply.setCookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/auth",
                maxAge: configService.getRefreshTokenExpiresInSeconds()
            });

            reply.send({ ...user, accessToken, refreshToken });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    logout = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = req.user as { uid: string };
            await this.authService.logout(user.uid);

            reply.clearCookie("refreshToken", { path: "/auth" });

            reply.send({ message: "Logged out successfully" });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    refresh = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const oldToken = req.cookies.refreshToken;
            if (!oldToken) return reply.status(401).send({ error: "No refresh token" });

            const { accessToken, refreshToken } = await this.authService.refreshToken(oldToken);

            reply.setCookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                path: "/auth",
                maxAge: configService.getRefreshTokenExpiresInSeconds()
            });

            reply.send({ accessToken });
        } catch (err: any) {
            reply.status(401).send({ error: err.message });
        }
    };
}
