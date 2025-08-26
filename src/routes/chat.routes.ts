import {FastifyInstance} from "fastify";
import {chatController} from "../controllers";

export const chatRoutes = async (app: FastifyInstance) => {

    app.post(
        "/",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.createChat
    );

    app.post(
        "/restore",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.restoreChat
    );

    app.get(
        "/with/:friendId",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.getChatBetween
    );

    app.post(
        "/:chatId/archive",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.archiveChat
    );

    app.post(
        "/send",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.sendMessage
    );

    app.get(
        "/my",
        {preValidation: [app.authenticate.bind(app)]},
        chatController.getMyChats
    )

};
