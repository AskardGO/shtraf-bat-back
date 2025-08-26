import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

export const authenticate: FastifyPluginAsync = async (app) => {
    app.decorate(
        'authenticate',
        async function (request, reply) {
            console.log('Authenticating request...');
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.send(err);
            }
        }
    );
};

export default fp(authenticate, { name: 'authenticate-plugin' });
