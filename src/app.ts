import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import mongoose from "mongoose";

import {configService} from "./config/ConfigService";
import {swaggerPlugin} from "./plugins/swagger";

import {authRoutes} from "./routes/auth.routes";
import {userRoutes} from "./routes/user.routes";
import {friendRoutes} from "./routes/friend.routes";

import websocket from "fastify-socket.io";
import authenticate from './plugins/authenticate';
import {wsService, authService} from "./services";
import {chatRoutes} from "./routes/chat.routes";

export const buildApp = async () => {
    const app = fastify();

    authService.setApp(app);

    await swaggerPlugin(app);

    await app.register(cors, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });
    await app.register(cookie);
    await app.register(jwt, {secret: configService.getJwtSecret()});

    await app.register(authenticate);

    try {
        await mongoose.connect(configService.getMongoUri());
    } catch (err) {
        process.exit(1);
    }

    await app.register(websocket, { cors: { origin: "*" } });
    await wsService.register(app.io);

    await app.register(authRoutes, {prefix: "/auth"});
    await app.register(userRoutes, {prefix: "/users"});
    await app.register(friendRoutes, {prefix: "/friends"});
    await app.register(chatRoutes, {prefix: "/chats"});

    return app;
};
