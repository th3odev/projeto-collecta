// frontend/js/components/navbar.js

import { getMe } from "/jsApiLayer/user.js";
import { logout } from "/jsApiLayer/auth.js";

export async function loadNavbar() {
    let user = null;
    try {
        user = await getMe();
    } catch (_) {}

    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-expand-lg navbar-dark bg-primary mb-4';

    if (user) {
        navbar.innerHTML = `
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">EcoAdmin</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="conflicts.html">Conflitos</a></li>
                        <li class="nav-item"><a class="nav-link" href="recompensa.html">Recompensas</a></li>
                        <li class="nav-item"><a class="nav-link" href="item.html">Itens</a></li>
                        <li class="nav-item"><a class="nav-link" href="logs.html">Logs</a></li>
                    </ul>
                    <div class="d-flex align-items-center text-white">
                        <span class="me-3"><strong>${user.apelido}</strong> (${user.pontos_atuais} pts)</span>
                        <button id="logout-btn" class="btn btn-outline-light">Logout</button>
                    </div>
                </div>
            </div>
        `;

        navbar.querySelector('#logout-btn').onclick = () => {
            logout();
            location.href = 'index.html';
        };
    } else {
        navbar.innerHTML = `
            <div class="container-fluid justify-content-center">
                <a class="navbar-brand fs-3 fw-bold" href="index.html">EcoAdmin</a>
            </div>
            <div class="container-fluid text-center mt-3">
                <a href="index.html" class="btn btn-light btn-lg px-5 py-3 fs-4">Login</a>
            </div>
        `;
    }

    document.body.prepend(navbar);

    return user; // return user for page state
}