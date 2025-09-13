import { FastifyRequest, FastifyReply } from 'fastify';
import * as services from "../services/diarioService";

/* export const getDiarios = async (req: FastifyRequest, res: FastifyReply) => {

} */

export const getDiarios = async (req: FastifyRequest, res: FastifyReply) => {
    const httpResponse = await services.getDiarioService();

    res.code(httpResponse.statusCode).send(httpResponse.json);
}