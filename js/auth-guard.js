(function () {
    const token        = localStorage.getItem('token');
    const userRole      = localStorage.getItem('userRole');
    const requiredRole  = window.requiredRole;

    if (!token) {
        window.location.href = 'login.html';
        return;
    }
 
    if (requiredRole && userRole !== requiredRole) {
        mostrarAvisoAccesoDenegado(() => {
            if (userRole === 'admin')      window.location.href = 'dashboardAdmin.html';
            else if (userRole === 'coach') window.location.href = 'dashboardCoach.html';
            else                           window.location.href = 'dashboardUsuario.html';
        });
        return;
    }

    function mostrarAvisoAccesoDenegado(callback) {
        const mostrar = () => {
            const aviso = document.createElement('div');
            aviso.textContent = '⚠️ No tienes permisos para acceder a esta sección. Redirigiendo...';
            aviso.style.position   = 'fixed';
            aviso.style.top        = '0';
            aviso.style.left       = '0';
            aviso.style.width      = '100%';
            aviso.style.zIndex     = '9999';
            aviso.style.padding    = '14px';
            aviso.style.textAlign  = 'center';
            aviso.style.fontWeight = '600';
            aviso.style.fontFamily = 'system-ui, sans-serif';
            aviso.style.background = '#fde8e8';
            aviso.style.color      = '#721c24';
            aviso.style.borderBottom = '1px solid #f8b4b4';
 
            document.body.appendChild(aviso);
            setTimeout(callback, 1500);
        };
 
        if (document.body) {
            mostrar();
        } else {
            document.addEventListener('DOMContentLoaded', mostrar);
        }
    }
})();


