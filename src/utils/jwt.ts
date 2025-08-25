import { FastifyInstance } from "fastify";

export interface IJwtPayload {
    uid: string;
    login: string;
}

export const signJwt = (app: FastifyInstance, payload: IJwtPayload, expiresIn: string = "15m") => {
    return app.jwt.sign(payload, { expiresIn });
};
