import { FastifyPluginAsync } from "fastify";

export const authenticate: FastifyPluginAsync = async (app) => {
    app.decorate(
        "authenticate",
        async (req: any, reply: any) => {
            try {
                await req.jwtVerify();
            } catch (err) {
                reply.send(err);
            }
        }
    );
};
