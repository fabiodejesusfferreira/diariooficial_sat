import { FastifyInstance } from 'fastify';
import { getDiarios } from '../controllers/diarioController';

export default async function router(fastify: FastifyInstance) {
    fastify.get("/diarios", getDiarios)
    /* fastify.post("/diarios", postDiario)
    fastify.patch("/diarios/:id", updateDiario)
    fastify.delete("/diarios/:id", deleteDiario) */
}