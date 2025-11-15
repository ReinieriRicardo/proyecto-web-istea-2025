document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    
    const errorElement = document.createElement('p');
    errorElement.className = 'login-error';
    errorElement.style.color = 'red';
    errorElement.style.textAlign = 'center';
    errorElement.style.marginTop = '10px';
    errorElement.style.display = 'none';
    loginForm.appendChild(errorElement);

    loginForm.addEventListener('submit', (e) => {
        handleLogin(e, errorElement);
    });
});

function handleLogin(e, errorElement) {
    e.preventDefault(); 
    errorElement.style.display = 'none';

    // --- usuarios ---
    const ADMIN_USER = {
        email: 'admin@artemis.com',
        password: 'admin123'
    };
    const REGULAR_USER = {
        email: 'cliente@gmail.com',
        password: 'cliente123'
    };
    // ------------------------------------

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // --- validacion ---

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isAdmin');

    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isAdmin', 'true');
        
        alert('¡Bienvenido, Administrador!');
        window.location.href = 'admin.html';
        return;
    }

    if (email === REGULAR_USER.email && password === REGULAR_USER.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isAdmin', 'false');

        alert('¡Inicio de sesión exitoso!');
        window.location.href = 'index.html';
        return;
    }

    errorElement.textContent = 'Correo electrónico o contraseña incorrectos.';
    errorElement.style.display = 'block';
}