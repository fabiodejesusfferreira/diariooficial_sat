// Código Novo (ES6)
document.addEventListener('DOMContentLoaded', async () => {
    const pdfListContainer = document.getElementById('pdfList');
    const backendUrl = 'http://localhost:3000';

    try {
        const response = await fetch(`${backendUrl}/api/files`);

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
            link.textContent = filename.replace(/-\d{13}-\d{1,9}/, ''); // Tenta limpar o nome do arquivo
            link.target = '_blank';
            link.download = filename;
            pdfListContainer.appendChild(link);
        });

    } catch (error) {
        pdfListContainer.innerHTML = '<p>Não foi possível carregar a lista de documentos. Tente novamente mais tarde.</p>';
        console.error('Erro ao buscar arquivos:', error);
    }
});