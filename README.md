# Shtraf-Bat Backend

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)](https://www.fastify.io/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
</div>

## 📋 Project Overview

Shtraf-Bat Backend is a high-performance Node.js server that powers the Shtraf-Bat chat application. Built with modern technologies and following SOLID principles, it provides secure authentication, real-time messaging, and comprehensive user management features.

## ✨ Features

- 🔐 JWT-based authentication with refresh tokens
- 💬 Real-time messaging with Socket.IO
- 👥 Friend system with invitations
- 🏗️ Clean architecture following SOLID principles
- 📊 Interactive message system
- 🔄 Real-time presence tracking
- 📝 Comprehensive API documentation with Swagger
- 🛡️ Secure password hashing with bcrypt
- 🚀 High-performance Fastify framework

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Documentation**: Swagger/OpenAPI
- **Development**: ts-node, ESLint
- **Package Manager**: Yarn

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn (v1.22 or later)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shtraf-bat-backend.git
   cd shtraf-bat-backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

   Example `.env` configuration:
   ```env
   PORT=4000
   MONGO_USER=your_mongodb_user
   MONGO_PASS=your_mongodb_password
   MONGO_CLUSTER=your_cluster.mongodb.net
   MONGO_DB=shtrafbat
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Development

Start the development server:
```bash
yarn dev
```

The server will be available at `http://localhost:4000`

### Building for Production

Create a production build:
```bash
yarn build
```

## 📁 Project Structure

```
src/
├── config/               # Configuration services
├── controllers/          # Request handlers
│   ├── AuthController.ts    # Authentication endpoints
│   ├── ChatController.ts    # Chat management
│   ├── FriendController.ts  # Friend system
│   └── UserController.ts    # User management
├── models/               # Database models
│   ├── User.ts             # User schema
│   ├── Chat.ts             # Chat schema
│   ├── Message.ts          # Message schema
│   ├── FriendInvitation.ts # Friend invitation schema
│   └── InteractiveMessage.ts # Interactive message schema
├── repositories/         # Data access layer
├── routes/              # API route definitions
├── services/            # Business logic layer
│   ├── AuthService.ts      # Authentication logic
│   ├── ChatService.ts      # Chat operations
│   ├── FriendService.ts    # Friend management
│   └── WebSocketService.ts # Real-time communication
├── plugins/             # Fastify plugins
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── app.ts               # Application setup
└── server.ts            # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `GET /users/search` - Search users

### Friends
- `GET /friends` - Get friends list
- `POST /friends/invite` - Send friend invitation
- `POST /friends/accept/:id` - Accept friend invitation
- `DELETE /friends/:id` - Remove friend

### Chats
- `GET /chats/my` - Get user's chats
- `POST /chats` - Create new chat
- `GET /chats/:id/messages` - Get chat messages
- `POST /chats/:id/messages` - Send message

## 🔄 Real-time Events

The WebSocket service handles real-time communication:

- `user:online` - User comes online
- `user:offline` - User goes offline
- `message:new` - New message received
- `chat:created` - New chat created
- `friend:invitation` - Friend invitation received

## 🧪 API Documentation

When running in development mode, visit `http://localhost:4000/docs` to access the interactive Swagger API documentation. (need to update)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Fastify](https://www.fastify.io/) for the high-performance web framework
- [MongoDB](https://www.mongodb.com/) for the flexible NoSQL database
- [Socket.IO](https://socket.io/) for real-time communication capabilities
- All contributors who helped improve this project

---

<div align="center">
  Made with ❤️ by Vitalii Trebko
</div>

