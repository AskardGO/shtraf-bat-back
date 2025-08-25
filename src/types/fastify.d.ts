import "fastify";
import "@fastify/jwt";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { uid: string; login: string };
        user: { uid: string; login: string };
    }
}

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (req: any, reply: any) => Promise<void>;
    }
}
