// Código Novo (ES6)
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const statusMessage = document.getElementById('statusMessage');

    statusMessage.textContent = 'Verificando...';
    statusMessage.style.color = 'orange';

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Erro desconhecido');
        }

        localStorage.setItem('jwtToken', result.token);
        statusMessage.textContent = 'Login bem-sucedido! Redirecionando...';
        statusMessage.style.color = 'green';
        window.location.href = 'admin.html';

    } catch (error) {
        statusMessage.textContent = `Erro no login: ${error.message}`;
        statusMessage.style.color = 'red';
    }
});