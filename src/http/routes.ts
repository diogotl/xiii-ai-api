import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import { uploadVideo } from "./controllers/upload-video";
import { getAllPrompts } from "./controllers/get-all-prompts";
import { createTranscript } from "./controllers/create-transcript";
import { generateAi } from "./controllers/generate-ai-completion";

export async function appRoutes(app: FastifyInstance) {

    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1048576 * 25 // 25MB
        },
    });

    app.post('/videos', uploadVideo);
    app.get('/prompts', getAllPrompts);
    app.post('/videos/:videoId/transcription', createTranscript);
    app.post('/ai', generateAi);

}