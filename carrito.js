document.addEventListener('DOMContentLoaded', () => {
    
    agruparItemsDelCarrito();
    renderizarItemsDelCarrito();
    actualizarResumenDeCompra();
    
    // Esta función ahora existirá porque cargamos app.js
    actualizarContadorHeader(); 
});

function agruparItemsDelCarrito() {
    // Esta función ahora existirá
    const carritoCrudo = obtenerCarritoGlobal(); 
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

    // Esta función ahora existirá
    guardarCarritoGlobal(Object.values(carritoAgrupado)); 
}

function renderizarItemsDelCarrito() {
    const contenedor = document.querySelector('.cart-items');
    // Esta función ahora existirá
    const carrito = obtenerCarritoGlobal(); 

    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
        actualizarTituloCarrito(0);
        return;
    }
    
    let totalItems = 0; // Calculamos el total de items para el título

    carrito.forEach(item => {
        // Esta función (parsePrecio) ahora existirá desde app.js
        const precioUnitario = parsePrecio(item.precio); 
        const subtotalItem = precioUnitario * item.cantidad;
        totalItems += item.cantidad;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.titulo}" class="cart-thumb">
                <div class="cart-info">
                    <h3>${item.titulo}</h3>
                    <p>Color: ${item.color || 'Único'}</p>
                    <p class="unit-price">$${formatearPrecio(precioUnitario)}</p>
                    <div class="quantity">
                        <button class="btn-restar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">-</button>
                        <input type="number" value="${item.cantidad}" min="1" readonly>
                        <button class="btn-sumar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">+</button>
                    </div>
                    <p class="subtotal">Subtotal: $${formatearPrecio(subtotalItem)}</p>
                    <button class="btn btn-danger btn-eliminar" data-titulo="${item.titulo}" data-color="${item.color || 'unico'}">Eliminar</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
    });

    actualizarTituloCarrito(totalItems); // Actualiza el h2
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

// -----------actualizar, eliminar-------------------------------

function actualizarCantidad(titulo, color, cambio) {
    const carrito = obtenerCarritoGlobal(); 
    const itemIndex = carrito.findIndex(item => item.titulo === titulo && (item.color || 'unico') === color);

    if (itemIndex === -1) return;
    const nuevaCantidad = carrito[itemIndex].cantidad + cambio;

    if (nuevaCantidad < 1) {
        eliminarItem(titulo, color);
    } else {
        carrito[itemIndex].cantidad = nuevaCantidad;
        guardarCarritoGlobal(carrito); 
        
        renderizarItemsDelCarrito();
        actualizarResumenDeCompra();
        // actualizarContadorHeader(); // No hace falta, guardarCarritoGlobal ya lo hace
    }
}

function eliminarItem(titulo, color) {
    let carrito = obtenerCarritoGlobal(); 
    const nuevoCarrito = carrito.filter(item => !(item.titulo === titulo && (item.color || 'unico') === color));
    
    guardarCarritoGlobal(nuevoCarrito); 
    
    renderizarItemsDelCarrito();
    actualizarResumenDeCompra();
    // actualizarContadorHeader(); // No hace falta, guardarCarritoGlobal ya lo hace
}

// -----------------resumen y header---------------------------

function actualizarResumenDeCompra() {
    const carrito = obtenerCarritoGlobal(); 
    const resumen = document.querySelector('.cart-summary');
    if (!resumen) return;

    const subtotal = carrito.reduce((acc, item) => {
        // Esta función (parsePrecio) ahora existirá
        const precio = parsePrecio(item.precio); 
        return acc + (precio * item.cantidad);
    }, 0);

    const envio = 0;
    const total = subtotal + envio;

    // ▼ CORREGIDO: formatearPrecio ▼
    resumen.querySelector('p:nth-of-type(1) strong').textContent = `$${formatearPrecio(subtotal)}`;
    resumen.querySelector('p:nth-of-type(2) span').textContent = (envio === 0) ? "Gratis" : `$${formatearPrecio(envio)}`;
    resumen.querySelector('p:nth-of-type(3) strong').textContent = `$${formatearPrecio(total)}`;
}


function actualizarTituloCarrito(totalItems) {
    const header = document.querySelector('.cart-header h2');
    if (header) {
        const plural = totalItems === 1 ? 'producto' : 'productos';
        header.textContent = `Carrito (${totalItems} ${plural})`;
    }
}