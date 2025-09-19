import { FastifyRequest, FastifyReply } from 'fastify';
import * as services from "../services/diarioService";
import { updateDatabaseFile } from '../services/githubService';
/* export const getDiarios = async (req: FastifyRequest, res: FastifyReply) => {

} */

interface PostBody {
    novoConteudo: object[];
    mensagemCommit: string;
}

export const getDiarios = async (req: FastifyRequest, res: FastifyReply) => {
    const httpResponse = await services.getDiarioService();

    res.code(httpResponse.statusCode).send(httpResponse.body);
}

export const postDiario = async (req: FastifyRequest<{ Body: PostBody }>, res: FastifyReply) => {
    const { novoConteudo, mensagemCommit } = req.body;

    if (!novoConteudo || !mensagemCommit) {
        return res.status(400).send({ error: 'Os campos "novoConteudo" e "mensagemCommit" são obrigatórios.' });
    }

    try {
        await updateDatabaseFile(novoConteudo, mensagemCommit);
        res.status(200).send({ message: 'Database atualizada com sucesso no GitHub!' });
    } catch (error) {
        req.log.error(error, 'Erro ao atualizar o arquivo no GitHub');
        const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor.';
        res.status(500).send({ error: errorMessage });
    }
}