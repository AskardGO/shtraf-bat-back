import "fastify";
import "@fastify/jwt";
import { Server as SocketIOServer } from 'socket.io';

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { uid: string; login: string };
        user: { uid: string; login: string };
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: any, reply: any) => Promise<void>;
        io: SocketIOServer;
    }
}
