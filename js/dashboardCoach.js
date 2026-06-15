document.addEventListener('DOMContentLoaded', () => {
    const btnPerfil = document.getElementById('btnMiPerfilCoachHeader');
    const navPanel = document.getElementById('navPanelCoach');
    const btnLogout = document.getElementById('btnCerrarSesion');
    const cardPanel = document.getElementById('cardPanelCoach');
    const cardPerfil = document.getElementById('moduloPerfilCoachCard');

    const perfilView = document.getElementById('perfilViewBlock');
    const perfilForm = document.getElementById('perfilEditForm');
    const btnEnableEdit = document.getElementById('btnEnableEdit');
    const btnCancelEdit = document.getElementById('btnCancelEdit');

    // Cambiar a Perfil
    btnPerfil?.addEventListener('click', (e) => {
        e.preventDefault();
        cardPanel.classList.add('hidden');
        cardPerfil.classList.remove('hidden');
    });

    // Volver a Panel (usando el enlace de navegación)
    navPanel?.addEventListener('click', (e) => {
        e.preventDefault();
        cardPerfil.classList.add('hidden');
        cardPanel.classList.remove('hidden');
    });

    // Cerrar sesión
    btnLogout?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Edición
    btnEnableEdit?.addEventListener('click', () => {
        perfilView.classList.add('hidden');
        perfilForm.classList.remove('hidden');
        document.getElementById('editName').value = document.getElementById('profileName').textContent;
        document.getElementById('editEmail').value = document.getElementById('profileEmail').textContent;
    });

    btnCancelEdit?.addEventListener('click', () => {
        perfilForm.classList.add('hidden');
        perfilView.classList.remove('hidden');
    });

    perfilForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('profileName').textContent = document.getElementById('editName').value;
        document.getElementById('profileEmail').textContent = document.getElementById('editEmail').value;
        perfilForm.classList.add('hidden');
        perfilView.classList.remove('hidden');
    });

    // Carga inicial
    document.getElementById('profileName').textContent = localStorage.getItem('userName');
    document.getElementById('profileEmail').textContent = localStorage.getItem('userEmail');
});