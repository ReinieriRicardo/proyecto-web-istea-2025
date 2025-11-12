// ---------------- FUNCIONALIDADES DE PÁGINA DE PRODUCTO ----------------

// Cambiar imagen principal al hacer clic en miniaturas
const miniaturas = document.querySelectorAll('.producto-miniaturas img');
const imagenPrincipal = document.querySelector('.producto-imagen-principal');

miniaturas.forEach(img => {
    img.addEventListener('click', () => {
        imagenPrincipal.src = img.src;
        imagenPrincipal.alt = img.alt;
    });
});

// Actualizar cantidad y color seleccionados (solo para depurar visual)
const selectColor = document.getElementById('color');
const inputCantidad = document.getElementById('cantidad');

selectColor.addEventListener('change', () => {
    console.log("Color seleccionado:", selectColor.value);
});

inputCantidad.addEventListener('input', () => {
    if (inputCantidad.value < 1) inputCantidad.value = 1;
});

// ---------------- CARRITO ----------------

// Obtener carrito existente o crear uno nuevo
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    carrito.push(producto);
    guardarCarrito(carrito);
}

// Contador del carrito en la cabecera
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const enlaceCarrito = document.querySelector('a[href="carrito.html"]');
    if (enlaceCarrito) {
        enlaceCarrito.innerHTML = `Carrito <img src="images/icons/shopping-bag.png" alt="icono carrito"> (${carrito.length})`;
    }
}

// Botones principales
const btnAgregar = document.querySelector('.btn-danger');
const btnComprar = document.querySelector('.btn-primary');

// Datos básicos del producto actual
const productoActual = {
    titulo: document.querySelector('.producto-detalles h2').textContent,
    precio: document.querySelector('.producto-precio').textContent.replace('$', '').trim(),
    imagen: imagenPrincipal.src,
    color: selectColor.value,
    cantidad: parseInt(inputCantidad.value)
};

btnAgregar.addEventListener('click', () => {
    const producto = { ...productoActual, color: selectColor.value, cantidad: parseInt(inputCantidad.value) };
    agregarAlCarrito(producto);
});

btnComprar.addEventListener('click', () => {
    const producto = { ...productoActual, color: selectColor.value, cantidad: parseInt(inputCantidad.value) };
    agregarAlCarrito(producto);
    window.location.href = "carrito.html";
});

// Inicializar contador al cargar
actualizarContadorCarrito();
