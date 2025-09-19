import { FastifyInstance } from 'fastify';
// Importa a nova função do controller
import { getDiarios, postDiario } from '../controllers/diarioController';

export default async function router(fastify: FastifyInstance) {
    fastify.get("/diarios", getDiarios);
    
    // Descomenta e aponta para a nova função
    fastify.post("/diarios", postDiario); 
    
    /* fastify.patch("/diarios/:id", updateDiario)
    fastify.delete("/diarios/:id", deleteDiario) */
}