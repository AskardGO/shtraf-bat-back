# Shtraf-Bat Backend

**Author:** Vitalii Trebko  
**Project:** Backend for a chat application with registration, login, and real-time messaging system.  
Shtraf-Bat Backend is an educational project implementing the server-side of a chat application. It uses a modern tech stack including Fastify, MongoDB, JWT, and Socket.IO. Features include user registration and authentication with JWT tokens, storage of users, chats, and messages in MongoDB, real-time chat support using WebSocket (Socket.IO), and an architecture that follows SOLID principles and OOP approach.  

The project is educational and demonstrational, emphasizing clean and maintainable code, integration of modern web development technologies, quick adaptability and extensibility of functionality, and ease of testing and understanding backend concepts.  

## Technologies Used
| Technology | Description |
|------------|-------------|
| **Node.js** | JavaScript runtime for the server, providing high performance. |
| **Fastify** | Lightweight and fast web framework for Node.js with plugin support and TypeScript typings. |
| **TypeScript** | Adds static typing to JavaScript, improves code reliability and maintainability. |
| **MongoDB** | NoSQL database for storing users, chats, and messages. |
| **Mongoose** | ODM (Object Data Modeling) library for MongoDB and Node.js. |
| **@fastify/jwt** | Plugin for JWT-based authentication in Fastify. |
| **bcrypt** | Library for hashing and verifying passwords. |
| **Socket.IO** | Enables real-time bidirectional communication for chat functionality. |
| **dotenv** | Loads environment variables from a `.env` file for configuration. |

## Getting Started
1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shtraf-bat-backend.git
cd shtraf-bat-backend
```
2. **Install dependencies**
```bash
yarn install
```
3. **Create a `.env` file** based on `.env.example`
```
PORT=3000
MONGO_USER=your_user
MONGO_PASS=your_password
MONGO_CLUSTER=your_cluster.mongodb.net
MONGO_DB=shtrafbat
JWT_SECRET=your_secret_key
```
4. **Run the server**
```bash
yarn dev
```
5. **Test API endpoints**  
Use Postman or any HTTP client to test: `POST /auth/register` and `POST /auth/login`.  
6. **Check MongoDB**  
Connect to MongoDB Compass or your Atlas cluster to see the `users` collection populated with test users.  

## Author
Vitalii Trebko  
Educational and personal projects focused on backend architecture, TypeScript, and modern web development.

