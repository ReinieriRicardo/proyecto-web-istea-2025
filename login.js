//--------login hardcodeado--------

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    
    
    const errorElement = document.createElement('p');
    errorElement.className = 'login-error';
    errorElement.style.color = 'red';
    errorElement.style.textAlign = 'center';
    errorElement.style.marginTop = '10px';
    errorElement.style.display = 'none'; // oculto por defecto
    loginForm.appendChild(errorElement);

    // escucha el evento 'submit' del formulario
    loginForm.addEventListener('submit', (e) => {
        handleLogin(e, errorElement);
    });
});

function handleLogin(e, errorElement) {
    // para que la página no se recargue
    e.preventDefault(); 

    // Ocultar error previo
    errorElement.style.display = 'none';

    // --- usuarios permitidos.
    const ADMIN_USER = {
        email: 'admin@artemis.com',
        password: 'admin123'
    };

    const REGULAR_USER = {
        email: 'cliente@gmail.com',
        password: 'cliente123'
    };

    // obtengo los valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // --- si es Admin
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        alert('¡Bienvenido, Administrador!');
        window.location.href = 'admin.html';
        return;
    }

    // si es Usuario Regular 
    if (email === REGULAR_USER.email && password === REGULAR_USER.password) {
        alert('¡Inicio de sesión exitoso!');
        window.location.href = 'index.html';
        return;
    }

    // si no coincide ninguno
    errorElement.textContent = 'Correo electrónico o contraseña incorrectos.';
    errorElement.style.display = 'block';
}