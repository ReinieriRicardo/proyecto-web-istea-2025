document.addEventListener('DOMContentLoaded', () => {
    agruparItemsDelCarrito();
    renderizarItemsDelCarrito();
    actualizarResumenDeCompra();
    actualizarContadorHeader();
});

// ------------LOCALSTORAGE Y PRECIOS------------

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function parsePrecio(precioString) {
    if (!precioString) return 0;
    return parseFloat(precioString.replace(/\./g, '').replace(',', '.')) || 0;
}

function formatPrecio(numero) {
    return numero.toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// ---------------Logica----------------------

function agruparItemsDelCarrito() {
    const carritoCrudo = obtenerCarrito();
    if (carritoCrudo.length === 0) return;

    const carritoAgrupado = carritoCrudo.reduce((acc, item) => {
        const clave = item.titulo + '_' + (item.color || 'unico');
        const cantidad = parseInt(item.cantidad) || 1;

        if (acc[clave]) {
            acc[clave].cantidad += cantidad;
        } else {
            acc[clave] = {
                ...item,
                cantidad: cantidad
            };
        }
        return acc;
    }, {});

    guardarCarrito(Object.values(carritoAgrupado));
}

function renderizarItemsDelCarrito() {
    const contenedor = document.querySelector('.cart-items');
    const carrito = obtenerCarrito();

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
        actualizarTituloCarrito(0);
        return;
    }

    carrito.forEach(item => {
        const precioUnitario = parsePrecio(item.precio);
        const subtotalItem = precioUnitario * item.cantidad;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.titulo}" class="cart-thumb">
                <div class="cart-info">
                    <h3>${item.titulo}</h3>
                    <p>Color: ${item.color || 'Único'}</p>
                    <p class="unit-price">$${formatPrecio(precioUnitario)}</p>
                    <div class="quantity">
                        <button class="btn-restar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">-</button>
                        <input type="number" value="${item.cantidad}" min="1" readonly>
                        <button class="btn-sumar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">+</button>
                    </div>
                    <p class="subtotal">Subtotal: $${formatPrecio(subtotalItem)}</p>
                    <button class="btn btn-danger btn-eliminar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">Eliminar</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
    });

    agregarEventListeners();
}

function agregarEventListeners() {
    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { titulo, color } = e.target.dataset;
            actualizarCantidad(titulo, color, 1);
        });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { titulo, color } = e.target.dataset;
            actualizarCantidad(titulo, color, -1);
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { titulo, color } = e.target.dataset;
            eliminarItem(titulo, color);
        });
    });
}

// --------actualizar y eliminar ------------------

function actualizarCantidad(titulo, color, cambio) {
    const carrito = obtenerCarrito();
    const itemIndex = carrito.findIndex(item => item.titulo === titulo && (item.color || 'unico') === color);

    if (itemIndex === -1) return;

    const nuevaCantidad = carrito[itemIndex].cantidad + cambio;

    if (nuevaCantidad < 1) {
        eliminarItem(titulo, color);
    } else {
        carrito[itemIndex].cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        
        renderizarItemsDelCarrito();
        actualizarResumenDeCompra();
        actualizarContadorHeader();
    }
}

function eliminarItem(titulo, color) {
    let carrito = obtenerCarrito();
    
    const nuevoCarrito = carrito.filter(item => !(item.titulo === titulo && (item.color || 'unico') === color));
    
    guardarCarrito(nuevoCarrito);
    
    renderizarItemsDelCarrito();
    actualizarResumenDeCompra();
    actualizarContadorHeader();
}

// --------Resumen y header-----------------

function actualizarResumenDeCompra() {
    const carrito = obtenerCarrito();
    const resumen = document.querySelector('.cart-summary');
    if (!resumen) return;

    const subtotal = carrito.reduce((acc, item) => {
        const precio = parsePrecio(item.precio);
        return acc + (precio * item.cantidad);
    }, 0);

    const envio = 0;
    const total = subtotal + envio;

    resumen.querySelector('p:nth-of-type(1) strong').textContent = `$${formatPrecio(subtotal)}`;
    resumen.querySelector('p:nth-of-type(2) span').textContent = (envio === 0) ? "Gratis" : `$${formatPrecio(envio)}`;
    resumen.querySelector('p:nth-of-type(3) strong').textContent = `$${formatPrecio(total)}`;
}

function actualizarContadorHeader() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    actualizarTituloCarrito(totalItems);

    const enlaceCarrito = document.querySelector('a[href="carrito.html"]');
    if (enlaceCarrito) {
        enlaceCarrito.innerHTML = `Carrito <img src="images/icons/shopping-bag.png" alt="icono carrito"> (${totalItems})`;
    }
}

function actualizarTituloCarrito(totalItems) {
    const header = document.querySelector('.cart-header h2');
    if (header) {
        const plural = totalItems === 1 ? 'producto' : 'productos';
        header.textContent = `Carrito (${totalItems} ${plural})`;
    }
}