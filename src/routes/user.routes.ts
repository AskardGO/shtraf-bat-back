import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../repositories/UserRepository";

export const userRoutes = async (app: FastifyInstance) => {
    const userRepo = new UserRepository();
    const userController = new UserController(userRepo);

    app.get("/users/:uid/status", userController.getStatus);
    app.get("/users/:uid", userController.getProfile);
    app.get("/users/me", { preValidation: [app.authenticate] }, userController.getMe);

};
