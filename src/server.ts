import { buildApp } from "./app";

const start = async () => {
    try {
        const app = await buildApp();
        await app.listen({ port: 4000 });
        console.log("🚀 Server running at http://localhost:4000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
