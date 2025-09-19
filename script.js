// Aguarda o carregamento completo do HTML para executar o script
document.addEventListener('DOMContentLoaded', () => {
    carregarDiariosDoGithub();
});

/**
 * Busca os dados do arquivo diarioDatabase.ts diretamente da API do GitHub
 * e renderiza a lista na página.
 */
async function carregarDiariosDoGithub() {
    const listaContainer = document.getElementById('listaDosDiarios');
    listaContainer.innerHTML = '<p>Carregando diários...</p>';

    // URL da API do GitHub para acessar o conteúdo do seu arquivo de database
    const GITHUB_API_URL = 'https://api.github.com/repos/fabiodejesusfferreira/diariooficial_sat/contents/src/api/src/database/diarioDatabase.ts';

    try {
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
            throw new Error(`Não foi possível buscar o arquivo no GitHub: ${response.statusText}`);
        }

        const fileData = await response.json();

        // 1. Decodificar o conteúdo que vem em Base64
        // A função atob() é nativa do navegador e decodifica Base64
        const conteudoDecodificado = atob(fileData.content);

        // 2. Limpar a string para extrair apenas o array JSON
        const stringJson = conteudoDecodificado
            .replace('export const database =', '') // Remove a exportação
            .replace(/;$/, '')                     // Remove o ponto e vírgula do final
            .trim();                               // Remove espaços em branco

        // 3. Converter a string do JSON para um objeto JavaScript
        const diarios = JSON.parse(stringJson);

        // Limpa a mensagem de "carregando"
        listaContainer.innerHTML = '';

        if (diarios.length === 0) {
            listaContainer.innerHTML = '<p>Nenhum diário encontrado.</p>';
            return;
        }

        // 4. Cria um item na lista para cada diário
        diarios.forEach(diario => {
            const itemLi = document.createElement('li');
            itemLi.id = 'itemDiario'; // Mantendo o ID para aplicar seu CSS

            const dataPublicacao = new Date(diario.date).toLocaleDateString('pt-BR');
            const titulo = `Diário Nº ${diario.id}, ${new Date(diario.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;

            itemLi.innerHTML = `
                <h2>${titulo}</h2>
                <p id="itemData">Data de publicação: ${dataPublicacao}</p>
                <div id="downloadContainer">
                    <div>
                        <a href="${diario.pdf || '#'}" target="_blank">
                            <img style="width: 18px; padding: 0px;" src="assets/pdfIcon.png" alt="ícone do PDF"> Baixar arquivo
                        </a>
                        <a id="pdfLink" target="_blank" href="${diario.pdf || '#'}">
                            <img style="width: 14px; padding: 0px;" id="shareBtn" src="assets/link.png" alt="link">
                        </a>
                    </div>
                    <p id="itemTamanho">${diario.size || 'N/A'}</p>
                </div>
            `;
            listaContainer.appendChild(itemLi);
        });

    } catch (error) {
        listaContainer.innerHTML = '<p style="color: red;">Falha ao carregar os diários do GitHub.</p>';
        console.error('Erro ao buscar diários:', error);
    }
}

const shareButton = document.getElementById("shareBtn");
const pdfLinkElement = document.getElementById("pdfLink");

// Pega a URL absoluta do link do PDF
// A propriedade .href retorna a URL completa (ex: https://site.com/documento.pdf)
const pdfUrl = pdfLinkElement.href;

shareButton.addEventListener("click", async () => {
  // Dados a serem compartilhados
  const shareData = {
    title: "Diario",
    text: "Teste",
    url: pdfUrl,
  };

  // Verifica se o navegador suporta a API de Compartilhamento Web
  if (navigator.share && navigator.canShare(shareData)) {
    console.log("Navigator can share");
    try {
      // Se suportar, abre a caixa de diálogo de compartilhamento nativa
      await navigator.share(shareData);
      showFeedback("Compartilhado com sucesso!");
    } catch (err) {
      // O usuário pode fechar a caixa de compartilhamento, o que gera um erro
      // Silenciamos o erro para não confundir, mas você pode registrar se quiser
      // console.error("Erro ao compartilhar: ", err);
      if (err.name !== "AbortError") {
        showFeedback("Ocorreu um erro ao compartilhar.");
      }
    }
  } else {
    // --- Fallback: Copiar para a Área de Transferência ---
    // Verifica se a API de Clipboard está disponível
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(pdfUrl);
        showFeedback("Link copiado para a área de transferência!");
      } catch (err) {
        showFeedback("Falha ao copiar o link.");
      }
    } else {
      // Fallback para navegadores muito antigos (raro)
      showFeedback(
        "Não foi possível compartilhar ou copiar. Por favor, copie o link manualmente."
      );
    }
  }
});
