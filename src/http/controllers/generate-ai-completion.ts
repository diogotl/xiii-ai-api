import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ReadStream, createReadStream } from "fs";
import { prisma } from '../../lib/prisma';
import path from "path";
import { openai } from "../../lib/openai";

export async function generateAi(request: FastifyRequest, reply: FastifyReply) {

    const bodySchema = z.object({
        videoId: z.string().uuid(),
        template: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, template, temperature } = bodySchema.parse(request.body);

    const video = await prisma.video.findFirstOrThrow({
        where: {
            id: videoId
        }
    });

    if (!video.transcript) {
        return reply.status(400).send({
            message: 'Transcript not generated'
        });
    }

    const promptMessage = template.replace('{transcription}', video.transcript);

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: temperature,
        messages: [
            {
                role: 'user',
                content: promptMessage
            }
        ]
    });

    return response;
}