import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import mongoose from "mongoose";
import { ConfigService } from "./config/ConfigService";
import {authRoutes} from "./routes/auth.routes";

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

    await app.register(authRoutes, { prefix: "/auth" });

    return app;
};
