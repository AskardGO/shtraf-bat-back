import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/AuthService";

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { login, password } = req.body as any;
            const result = await this.authService.register(login, password);
            reply.send(result);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    login = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { login, password } = req.body as any;
            const result = await this.authService.login(login, password);
            reply.send(result);
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

    logout = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = req.user as any;
            await this.authService.logout(user.uid);
            reply.send({ message: "Logged out successfully" });
        } catch (err: any) {
            reply.status(400).send({ error: err.message });
        }
    };

}
