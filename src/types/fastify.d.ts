import "@fastify/jwt";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { uid: string; login: string };
        user: { uid: string; login: string };
    }
}
