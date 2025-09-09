import { FastifyInstance } from "fastify";
import {userController} from "../controllers";

export const userRoutes = async (app: FastifyInstance) => {
    app.get("/:uid/status", userController.getStatus);
    app.get("/:uid", userController.getProfile);
    app.get("/me", { preValidation: [app.authenticate.bind(app)] }, userController.getMe);
    app.put("/me/displayed-name", { preValidation: [app.authenticate.bind(app)] }, userController.updateDisplayedName);
};
