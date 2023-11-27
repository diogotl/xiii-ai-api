import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";

export function getAllPrompts(request: FastifyRequest, reply: FastifyReply) {

    const prompts = prisma.prompt.findMany();

    return reply.code(200).send({
        prompts
    });
}