import axios from 'axios';

// Valida as variáveis de ambiente necessárias
const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
const FILE_PATH = "src/api/src/database/diarioDatabase.ts"; // Caminho fixo para o arquivo do banco

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  throw new Error('As variáveis de ambiente do GitHub (TOKEN, OWNER, REPO) não estão configuradas.');
}

const GITHUB_API_FILE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

const githubApi = axios.create({
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

/**
 * Busca o SHA atual do arquivo diarioDatabase.ts.
 * @returns {Promise<string>} O SHA do arquivo.
 */
async function getCurrentFileSHA(): Promise<string> {
  try {
    const response = await githubApi.get<{ sha: string }>(GITHUB_API_FILE_URL);
    return response.data.sha;
  } catch (error) {
    console.error('Falha ao obter o SHA do arquivo.', error);
    throw new Error('Não foi possível obter os metadados do arquivo no GitHub.');
  }
}

/**
 * Atualiza o conteúdo do arquivo diarioDatabase.ts no repositório do GitHub.
 * @param {object} newContent - O novo array de objetos que será salvo no arquivo.
 * @param {string} commitMessage - A mensagem de commit para esta alteração.
 */
export async function updateDatabaseFile(
  newContent: object[],
  commitMessage: string,
): Promise<void> {
  const currentSha = await getCurrentFileSHA();

  // Formata o conteúdo para ser um arquivo .ts exportável
  const contentString = `export const database = ${JSON.stringify(newContent, null, 4)};`;
  const contentBase64 = Buffer.from(contentString).toString('base64');

  try {
    await githubApi.put(GITHUB_API_FILE_URL, {
      message: commitMessage,
      content: contentBase64,
      sha: currentSha,
      branch: 'main', // Ou seu branch padrão
    });
    console.log('Arquivo de database atualizado com sucesso no GitHub.');
  } catch (error) {
    console.error('Falha ao atualizar o arquivo no GitHub.\n', error);
    throw new Error('Não foi possível atualizar o arquivo no GitHub.');
  }
}