import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ReadStream, createReadStream } from "fs";
import { prisma } from '../../lib/prisma';
import path from "path";
import { openai } from "../../lib/openai";

export async function createTranscript(request: FastifyRequest, reply: FastifyReply) {

    const paramsSchema = z.object({
        videoId: z.string().uuid()
    });

    const videoId = paramsSchema.parse(request.params).videoId;

    const bodySchema = z.object({
        prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findFirstOrThrow({
        where: {
            id: videoId
        }
    });

    console.log(video)

    const videoPath = video.path;

    const audioReadStream = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'srt',
        temperature: 0,
        prompt,
    });

    const videoUpdated = await prisma.video.update({
        where: {
            id: videoId,
        },
        data: {
            transcript: response.text
        }
    })

    console.log(videoUpdated);

    return reply.code(200).send({
        transcript: response
    });

}