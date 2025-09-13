// Código Novo (ES6)
document.addEventListener('DOMContentLoaded', async () => {
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
});