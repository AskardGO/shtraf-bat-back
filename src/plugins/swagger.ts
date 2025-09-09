import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export const swaggerPlugin = async (app: FastifyInstance) => {
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Shtraf-Bat Chat API',
        description: 'Backend API for Shtraf-Bat chat application',
        version: '1.0.0',
      },
      host: 'localhost:4000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'users', description: 'User management endpoints' },
        { name: 'friends', description: 'Friends management endpoints' },
        { name: 'chats', description: 'Chat management endpoints' },
      ],
      definitions: {
        User: {
          type: 'object',
          properties: {
            uid: { type: 'string', description: 'Unique user identifier' },
            login: { type: 'string', description: 'User login' },
            avatar: { type: 'string', nullable: true, description: 'User avatar URL' },
            isOnline: { type: 'boolean', description: 'User online status' },
            lastSeen: { type: 'string', format: 'date-time', description: 'Last seen timestamp' },
          },
        },
        Chat: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Chat identifier' },
            participants: { type: 'array', items: { type: 'string' }, description: 'Participant user IDs' },
            messages: { type: 'array', items: { type: 'string' }, description: 'Message IDs' },
            createdAt: { type: 'string', format: 'date-time', description: 'Chat creation timestamp' },
            archivedAt: { type: 'string', format: 'date-time', nullable: true, description: 'Chat archive timestamp' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Message identifier' },
            chatId: { type: 'string', description: 'Chat identifier' },
            senderId: { type: 'string', description: 'Sender user ID' },
            text: { type: 'string', description: 'Message text' },
            createdAt: { type: 'string', format: 'date-time', description: 'Message creation timestamp' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            uid: { type: 'string', description: 'User identifier' },
            login: { type: 'string', description: 'User login' },
            avatar: { type: 'string', nullable: true, description: 'User avatar URL' },
            accessToken: { type: 'string', description: 'JWT access token' },
            refreshToken: { type: 'string', description: 'Refresh token' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
          },
        },
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT token in format: Bearer <token>',
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};
