import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import {authController} from "../controllers";

export const authRoutes = async (app: FastifyInstance) => {

    app.post(
        "/register",
        authController.register
    );

    app.post(
        "/login",
        authController.login)
    ;

    app.post(
        "/logout",
        authController.logout
    );

    app.post(
        "/refresh",
        authController.refresh
    );

};
