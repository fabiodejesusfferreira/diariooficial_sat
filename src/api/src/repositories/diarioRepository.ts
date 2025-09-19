import axios from 'axios';

// Valida as variáveis de ambiente
const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
const FILE_PATH = "src/api/src/database/diarioDatabase.ts";

if (!GITHUB_OWNER || !GITHUB_REPO) {
  throw new Error('As variáveis de ambiente GITHUB_OWNER e GITHUB_REPO são obrigatórias.');
}

const GITHUB_API_FILE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

// Configura headers, incluindo o token se ele existir
const axiosConfig = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` })
  }
};

/**
 * Busca todos os registros do diário em tempo real, consultando a API do GitHub.
 * @returns Retorna uma promessa com o array de dados.
 */
export const findAll = async () => {
  try {
    console.log(`Buscando dados em tempo real de: ${GITHUB_API_FILE_URL}`);
    
    // 1. Faz a chamada GET para a API do GitHub
    const response = await axios.get<{ content: string }>(GITHUB_API_FILE_URL, axiosConfig);

    // 2. O conteúdo vem codificado em Base64, então precisamos decodificá-lo
    const contentBase64 = response.data.content;
    const contentString = Buffer.from(contentBase64, 'base64').toString('utf8');

    // 3. O conteúdo decodificado é o texto do arquivo .ts.
    // Precisamos extrair apenas o array JSON dele.
    // Ex: "export const database = [ { ... } ];" -> "[ { ... } ]"
    const jsonString = contentString
        .replace('export const database =', '') // Remove a exportação
        .replace(/;$/, '') // Remove o ponto e vírgula no final
        .trim(); // Remove espaços em branco

    // 4. Converte a string do JSON para um objeto JavaScript
    const data = JSON.parse(jsonString);

    return data;

  } catch (error) {
    console.error("Erro ao buscar ou processar o arquivo do GitHub:", error);
    // Retorna nulo ou lança um erro para a camada de serviço tratar
    return null;
  }
}