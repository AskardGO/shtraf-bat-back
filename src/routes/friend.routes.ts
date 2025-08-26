import { FastifyInstance } from "fastify";
import { FriendController } from "../controllers/FriendController";

const controller = new FriendController();

export const friendRoutes = async (app: FastifyInstance) => {
    app.post("/add", { preValidation: [app.authenticate] }, controller.addFriend.bind(controller));
    app.post("/remove/:friendId", { preValidation: [app.authenticate] }, controller.removeFriend.bind(controller));
    app.get("/list", { preValidation: [app.authenticate] }, controller.listFriends.bind(controller));
};
