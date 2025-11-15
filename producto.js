let productoActual = null;
let stockDisponible = 0;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    if (!productoId) {
        mostrarError("No se especificó ningún producto.");
        return;
    }

    cargarProducto(productoId);
});

// ---------------- LÓGICA DE CARGA DE PRODUCTO ----------------

function cargarProducto(id) {
    const productosGuardados = sessionStorage.getItem('todosLosProductos');
    
    if (!productosGuardados) {
        // Intentar recargar desde la página de inicio si falla
        mostrarError("Error al cargar datos. <a href='index.html'>Volver al inicio</a>");
        return;
    }

    const todosProductos = JSON.parse(productosGuardados);
    productoActual = todosProductos.find(p => p.id === id);

    if (!productoActual) {
        mostrarError("Producto no encontrado.");
        return;
    }

    stockDisponible = productoActual.stock || 0;
    renderizarProducto(productoActual);
}

function mostrarError(mensaje) {
    const mainContainer = document.getElementById('main-producto-container');
    mainContainer.innerHTML = `<div class="producto-error"><p>${mensaje}</p></div>`;
}

// ---------------- RENDERIZADO DEL DOM ----------------

function renderizarProducto(producto) {
    document.title = `${producto.titulo} - Tienda Artemis`;
    const mainContainer = document.getElementById('main-producto-container');

    let listaCaracteristicas = '';
    if (producto.caracteristicas) {
        const items = producto.caracteristicas.split(/,|\n/).filter(item => item.trim() !== '');
        listaCaracteristicas = '<ul>' + items.map(item => `<li>${item.trim()}</li>`).join('') + '</ul>';
    } else {
        listaCaracteristicas = '<p>No hay más detalles disponibles.</p>';
    }

    const htmlProducto = `
        <div class="producto-layout">
            <section class="producto-galeria">
                <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen-principal">
            </section>

            <section class="producto-detalles">
                <h2>${producto.titulo}</h2>
                <p class="producto-subtitulo">Nuevo | +150 vendidos (simulado)</p>
                <p class="producto-precio">$${producto.precioFormateado}</p>
                <p class="producto-envio">${producto.envio}</p>

                <p class="producto-stock" id="stock-display">
                    ${stockDisponible > 0 ? `¡Quedan ${stockDisponible} unidades!` : 'Sin stock'}
                </p>

                <div class="producto-opciones">
                    <label for="color">Color:</label>
                    <select id="color" ${stockDisponible === 0 ? 'disabled' : ''}>
                        <option>Negro</option>
                        <option>Marrón</option>
                        <option>Beige</option>
                    </select>
                </div>

                <div class="producto-cantidad">
                    <label for="cantidad">Cantidad:</label>
                    <input type="number" id="cantidad" value="1" min="1" ${stockDisponible === 0 ? 'disabled' : ''}>
                </div>

                <button class="btn btn-primary" id="btn-comprar" ${stockDisponible === 0 ? 'disabled' : ''}>
                    ${stockDisponible === 0 ? 'Sin Stock' : 'Comprar ahora'}
                </button>
                <button class="btn btn-danger" id="btn-agregar" ${stockDisponible === 0 ? 'disabled' : ''}>
                    ${stockDisponible === 0 ? 'Sin Stock' : 'Agregar al carrito'}
                </button>

                <div class="producto-beneficios">
                    <p>💳 Hasta 6 cuotas sin interés con tarjeta de crédito.</p>
                    <p>📦 Devolución gratis en los primeros 30 días.</p>
                </div>
            </section>
        </div>

        <section class="producto-descripcion">
            <h3>Descripción</h3>
            <p>${producto.descripcion || 'Este producto no tiene descripción.'}</p>
            <h3>Características</h3>
            ${listaCaracteristicas}
        </section>
    `;

    mainContainer.innerHTML = htmlProducto;
    agregarListenersBotones();
}

// ---------------- CARRITO ----------------

function agregarListenersBotones() {
    const btnAgregar = document.getElementById('btn-agregar');
    const btnComprar = document.getElementById('btn-comprar');
    const inputCantidad = document.getElementById('cantidad');
    const selectColor = document.getElementById('color');

    if (!btnAgregar || !btnComprar) return; // Salir si los botones no existen

    inputCantidad.addEventListener('input', () => {
        let cantidad = parseInt(inputCantidad.value);
        if (isNaN(cantidad) || cantidad < 1) {
            inputCantidad.value = 1;
        }
        if (cantidad > stockDisponible) {
            alert(`Solo quedan ${stockDisponible} unidades disponibles.`);
            inputCantidad.value = stockDisponible;
        }
    });

    btnAgregar.addEventListener('click', () => {
        const cantidad = parseInt(inputCantidad.value);
        if (cantidad > stockDisponible) {
            alert(`Solo quedan ${stockDisponible} unidades disponibles.`);
            return;
        }
        
        const productoParaCarrito = {
            titulo: productoActual.titulo,
            precio: productoActual.precioFormateado,
            imagen: productoActual.imagen,
            color: selectColor.value,
            cantidad: cantidad
        };
        
        agregarAlCarrito(productoParaCarrito);
        alert('¡Producto agregado al carrito!');
    });

    btnComprar.addEventListener('click', () => {
        const cantidad = parseInt(inputCantidad.value);
        if (cantidad > stockDisponible) {
            alert(`Solo quedan ${stockDisponible} unidades disponibles.`);
            return;
        }

        const productoParaCarrito = {
            titulo: productoActual.titulo,
            precio: productoActual.precioFormateado,
            imagen: productoActual.imagen,
            color: selectColor.value,
            cantidad: cantidad
        };
        
        agregarAlCarrito(productoParaCarrito);
        window.location.href = "carrito.html";
    });
}

function agregarAlCarrito(producto) {
    // Usar las funciones globales de app.js
    const carrito = obtenerCarritoGlobal();
    
    const clave = producto.titulo + '_' + producto.color;
    const itemExistenteIndex = carrito.findIndex(item => (item.titulo + '_' + item.color) === clave);

    if (itemExistenteIndex > -1) {
        carrito[itemExistenteIndex].cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }
    
    guardarCarritoGlobal(carrito);
}