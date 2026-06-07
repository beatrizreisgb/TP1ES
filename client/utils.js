const API = 'http://localhost:3030/api';

function showToast(message, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

async function logout(event) {
    event.preventDefault();
    try {
        await fetch(`${API}/users/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
    } catch (_) {}
    // força remoção do cookie no cliente independente da resposta
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return document.cookie.split(';').some(c => c.trim().startsWith('jwt='));
}

function setupNav() {
    const loggedIn = isLoggedIn();
    ['logout'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (!loggedIn) { el.style.display = 'none'; }
            else { el.addEventListener('click', logout); }
        }
    });
    ['myaccount', 'myorders', 'cadastrar-produto', 'meus-produtos'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !loggedIn) el.style.display = 'none';
    });
    const loginEl = document.getElementById('login');
    if (loginEl && loggedIn) loginEl.style.display = 'none';
}

function statusBadge(status) {
    const labels = {
        PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado',
        EM_ENTREGA: 'Em Entrega', ENTREGUE: 'Entregue', CANCELADO: 'Cancelado'
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

function roleLabel(role) {
    return { user: 'Cliente', owner: 'Proprietário', deliverer: 'Entregador', admin: 'Admin' }[role] || role;
}
