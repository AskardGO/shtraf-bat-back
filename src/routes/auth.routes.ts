import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

export const authRoutes = async (app: FastifyInstance) => {
    const userRepo = new UserRepository();
    const authService = new AuthService(userRepo, app);
    const authController = new AuthController(authService);

    app.post("/register", authController.register);
    app.post("/login", authController.login);
    app.post("/logout", authController.logout);
    app.post("/refresh", authController.refresh);
};
