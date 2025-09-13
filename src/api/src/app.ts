import fastify from "fastify";
import router from "./routes/routes"

import cors from "@fastify/cors";

export default function createApp() {
    const app = fastify({ logger: true })

    app.register(cors, {
        origin:  ["*"],
    });

    app.register(router, { prefix: "/api"})

    return app;
}