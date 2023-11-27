import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';

const pump = promisify(pipeline);

export async function uploadVideo(request: FastifyRequest, reply: FastifyReply) {

    const data = await request.file();

    if (!data) {
        return reply.code(400).send({
            error: 'No file uploaded'
        });
    }

    const extension = path.extname(data.filename);

    console.log(extension);

    if (extension !== '.mp3') {
        return reply.code(400).send({
            error: 'Only mp3 files are allowed'
        });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const uploadDestination = path.resolve(__dirname, '../../../tmp', fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
        data: {
            title: fileBaseName,
            path: uploadDestination,
        }
    })

    return reply.code(200).send({
        video
    });
}
