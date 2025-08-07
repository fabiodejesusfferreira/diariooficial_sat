// Código Novo (ES6)

// IIFE (Immediately Invoked Function Expression) com Arrow Function
(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }
})();

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('pdfFile');
    const statusMessage = document.getElementById('statusMessage');
    const file = fileInput.files[0];
    const token = localStorage.getItem('jwtToken');

    if (!file) {
        statusMessage.textContent = 'Por favor, selecione um arquivo.';
        statusMessage.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('pdfFile', file);

    statusMessage.textContent = 'Enviando...';
    statusMessage.style.color = 'orange';

    try {
        const response = await fetch('http://localhost:3000/api/files/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (response.status === 401 || response.status === 403) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            localStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        statusMessage.textContent = `Sucesso! Arquivo "${result.filename}" enviado.`;
        statusMessage.style.color = 'green';
        fileInput.value = '';

    } catch (error) {
        statusMessage.textContent = `Erro ao enviar: ${error.message}`;
        statusMessage.style.color = 'red';
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    alert('Você foi desconectado.');
    window.location.href = 'login.html';
});