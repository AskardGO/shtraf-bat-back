import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import mongoose from "mongoose";
import { ConfigService } from "./config/ConfigService";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { authenticate } from "./plugins/authenticate";

const configService = new ConfigService();

export const buildApp = async () => {
    const app = fastify();

    await app.register(cors, { origin: true });
    await app.register(cookie);
    await app.register(jwt, { secret: configService.getJwtSecret() });

    try {
        await mongoose.connect(configService.getMongoUri());
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }

    app.register(authenticate);
    await app.register(authRoutes, { prefix: "/auth" });
    await app.register(userRoutes, { prefix: "/users" });

    return app;
};
