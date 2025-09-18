// Código Novo (ES6)
/* document.addEventListener('DOMContentLoaded', async () => {
    const pdfListContainer = document.querySelector('#pdfList');
    pdfListContainer.innerText = 'macumba'
    const backendUrl = 'http://localhost:3030';

    try {
        const token = '45cd858b5a3311123e5266810be74890'
        const response = await fetch(`${backendUrl}/api/files`, {
            method: "GET",
            headers: {
                "authorization": token
            }
        });

        if (!response.ok) {
            // Se a resposta não for OK (ex: 401, 403, 500), trata como erro.
            // Para a página pública, isso pode acontecer se o endpoint for protegido indevidamente.
            throw new Error(`Erro na rede ou no servidor: ${response.statusText}`);
        }
        
        const files = await response.json();
        pdfListContainer.innerHTML = '';

        if (files.length === 0) {
            pdfListContainer.innerHTML = '<p>Nenhum documento disponível no momento.</p>';
            return;
        }

        files.forEach(filename => {
            const link = document.createElement('a');
            link.href = `${backendUrl}/downloads/${filename}`;
            link.target = '_blank';
            link.download = filename;
            pdfListContainer.appendChild(link);
        });

    } catch (error) {
        pdfListContainer.innerHTML = '<p>Não foi possível carregar a lista de documentos. Tente novamente mais tarde.</p>';
        console.error('Erro ao buscar arquivos:', error);
    }
}); */

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
