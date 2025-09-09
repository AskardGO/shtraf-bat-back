import { FastifyInstance } from "fastify";
import { FriendController } from "../controllers/FriendController";

const controller = new FriendController();

export const friendRoutes = async (app: FastifyInstance) => {
    app.post("/add", { preValidation: [app.authenticate] }, controller.addFriend.bind(controller));
    app.post("/remove/:friendId", { preValidation: [app.authenticate] }, controller.removeFriend.bind(controller));
    app.get("/list", { preValidation: [app.authenticate] }, controller.listFriends.bind(controller));

    app.post("/invite", { preValidation: [app.authenticate] }, controller.sendFriendInvitation.bind(controller));
    app.post("/invite/:invitationId/accept", { preValidation: [app.authenticate] }, controller.acceptFriendInvitation.bind(controller));
    app.post("/invite/:invitationId/decline", { preValidation: [app.authenticate] }, controller.declineFriendInvitation.bind(controller));
    app.get("/invitations", { preValidation: [app.authenticate] }, controller.getFriendInvitations.bind(controller));
    
    app.get("/rejected", { preValidation: [app.authenticate] }, controller.getRejectedFriends.bind(controller));
    app.post("/rejected/:friendRequestId/accept", { preValidation: [app.authenticate] }, controller.acceptRejectedFriend.bind(controller));
    
    app.get("/interactive-messages/:chatId", { preValidation: [app.authenticate] }, controller.getInteractiveMessages.bind(controller));
    app.post("/cleanup-stale-messages", { preValidation: [app.authenticate] }, controller.cleanupStaleInteractiveMessages.bind(controller));
};
