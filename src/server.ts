import { buildApp } from "./app";

const start = async () => {
    const app = await buildApp();
    try {
        await app.listen({ port: 4000 });
        console.log("🚀 Server running at http://localhost:4000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
