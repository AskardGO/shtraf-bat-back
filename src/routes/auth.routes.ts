import { FastifyInstance } from "fastify";
import {authController} from "../controllers";

export const authRoutes = async (app: FastifyInstance) => {
    app.post("/register", authController.register);
    app.post("/login", authController.login);
    app.post("/logout", { preValidation: [app.authenticate.bind(app)] }, authController.logout);
    app.post("/refresh", authController.refresh);
};
