import { fastify } from "fastify";
import { prisma } from "./lib/prisma";
import { appRoutes } from "./http/routes";

const app = fastify();

app.register(appRoutes);

app
    .listen({
        port: 3333,
    })
    .then(() => {
        console.log("Server is running on port 3333");
    });
