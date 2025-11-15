// ---------------- CONFIGURACIÓN DE AIRTABLE ----------------
// app.js (parte superior)
const AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const AIRTABLE_TABLE_NAME = AIRTABLE_CONFIG.TABLE_NAME;

// URL base de la API
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?pageSize=100`;

// Array de los productos
let misProductos = [];

// ---------------- FUNCIONES----------------

// Formatear precios
function formatearPrecio(precio) {
    if (precio === null || precio === undefined || precio === '') return "0";
    
    let numero;
    if (typeof precio === 'number') {
        numero = precio;
    } else if (typeof precio === 'string') {
        if (precio.includes(',') && precio.includes('.')) {
            numero = parseFloat(precio.replace(/\./g, '').replace(',', '.'));
        } else if (precio.includes(',')) {
            numero = parseFloat(precio.replace(',', '.'));
        } else {
            numero = parseFloat(precio);
        }
    } else {
        numero = 0;
    }
    
    if (isNaN(numero)) return "0";
    
    return numero.toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// ---------------- FUNCIONES DE CARGA DE AIRTABLE ----------------

async function obtenerTodosLosProductos() {
    try {
        let allRecords = [];
        let offset = null;
        
        do {
            let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?pageSize=100`;
            if (offset) url += `&offset=${offset}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`
                }
            });

            if (!response.ok) throw new Error(`Error al obtener productos: ${response.status}`);

            const data = await response.json();
            allRecords = allRecords.concat(data.records);
            offset = data.offset;
            
            console.log(`Página obtenida: ${data.records.length} registros, offset: ${offset}`);
            
        } while (offset);

        console.log('Total de registros obtenidos con paginación:', allRecords.length);
        return allRecords;
        
    } catch (error) {
        console.error('Error en paginación:', error);
        throw error;
    }
}

// mensaje de error
function mostrarErrorProductos() {
    const productContainer = document.querySelector('.product-container');
    if (productContainer) {
        productContainer.innerHTML = `
            <div class="error-message">
                <p>No se pudieron cargar los productos. Por favor, intenta más tarde.</p>
            </div>
        `;
    }
}

// ---------------- FUNCIONES DEL DOM ----------------

// Crear las tarjetas
function crearProductosDesdeArray(productos) {
    const products = document.querySelector('.product-container');
    if (!products) return;
    
    products.innerHTML = '';
    
    if (productos.length === 0) {
        products.innerHTML = `
            <div class="no-products">
                <p>No se encontraron productos para esta categoría.</p>
            </div>
        `;
        return;
    }
    
    productos.forEach((producto) => {
        const newProduct = document.createElement('a');
        
        newProduct.href = `producto.html?id=${producto.id}`;
        newProduct.className = "product-card";
        
        newProduct.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" loading="lazy">
            <div class="description">
                <span class="price">$${producto.precioFormateado}</span>
                <span class="envio">${producto.envio || "Envio a toda la capital"}</span>
                <h3 class="product-description">${producto.titulo}</h3>
            </div>
        `;
        
        products.appendChild(newProduct);
    });
}

// ---------------- FILTRADO Y NAVEGACIÓN ----------------

function filtrarYActivarLinks() {
    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria');

    // Activar link de navegación
    document.querySelectorAll('.nav-link-todos, .nav-link-categoria').forEach(link => {
        link.classList.remove('active');
    });

    let productosFiltrados = misProductos;

    if (categoriaId) {
        productosFiltrados = misProductos.filter(p => p.categoria == categoriaId); // Use == for type coercion (string vs number)
        const linkActivo = document.querySelector(`.nav-link-categoria[data-categoria="${categoriaId}"]`);
        if(linkActivo) linkActivo.classList.add('active');
    } else {
        const linkTodos = document.querySelector('.nav-link-todos');
        if(linkTodos) linkTodos.classList.add('active');
    }

    // Solo renderizar si estamos en la página principal
    if (document.querySelector('.product-container')) {
        crearProductosDesdeArray(productosFiltrados);
    }
}

// ---------------- BUSCADOR ----------------

const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase().trim();
        
        if (searchText === '') {
            // Si se borra la búsqueda, volver a la vista filtrada por categoría
            filtrarYActivarLinks();
        } else {
            const filteredProducts = filterProducts(searchText);
            crearProductosDesdeArray(filteredProducts);
        }

        mostrarSugerencias(searchText);
    });
}

function filterProducts(text) {
    // El buscador siempre busca sobre TODOS los productos
    return misProductos.filter(product => 
        product.titulo.toLowerCase().includes(text.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(text.toLowerCase())
    );
}

// ---------- SUGERENCIAS DE BÚSQUEDA ----------
function mostrarSugerencias(texto) {
    let sugerencias = document.querySelector('.search-suggestions');
    if (!sugerencias) {
        sugerencias = document.createElement('ul');
        sugerencias.className = 'search-suggestions';
        document.querySelector('.search-bar').appendChild(sugerencias);
    }

    sugerencias.innerHTML = '';
    if (texto === '') {
        sugerencias.style.display = 'none';
        return;
    }

    const coincidencias = misProductos.filter(p =>
        p.titulo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    if (coincidencias.length === 0) {
        sugerencias.style.display = 'none';
        return;
    }

    coincidencias.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.titulo;
        li.addEventListener('click', () => {
            searchInput.value = p.titulo;
            window.location.href = `producto.html?id=${p.id}`; 
            sugerencias.style.display = 'none';
        });
        sugerencias.appendChild(li);
    });

    sugerencias.style.display = 'block';
}

// Ocultar sugerencias al hacer click fuera
document.addEventListener('click', (e) => {
    const sugerencias = document.querySelector('.search-suggestions');
    const barra = document.querySelector('.search-bar');
    if (sugerencias && !barra.contains(e.target)) {
        sugerencias.style.display = 'none';
    }
});

// ---------------- LÓGICA DE LOGIN Y ADMIN ----------------

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const isAdmin = sessionStorage.getItem('isAdmin');
    const navCategories = document.querySelector('.nav-categories');

    if (!navCategories) return;

    if (isLoggedIn === 'true') {
        const cuentaLink = navCategories.querySelector('.nav-link-cuenta');
        if (cuentaLink) {
            cuentaLink.textContent = 'Salir';
            cuentaLink.href = '#';
            cuentaLink.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('isAdmin');
                window.location.href = 'index.html';
            });
        }
        
        if (isAdmin === 'true' && !document.querySelector('.btn-admin-nav')) {
            const adminButton = document.createElement('li');
            adminButton.innerHTML = `<a href="admin.html" class="btn-admin-nav">Editar Productos</a>`;
            navCategories.appendChild(adminButton);
        }

    } else {
        const cuentaLink = navCategories.querySelector('.nav-link-cuenta');
        if (cuentaLink) {
             cuentaLink.innerHTML = `Cuenta <img src="images/icons/user.png" alt="icono usuario">`;
        }
    }
}

// ---------------- LÓGICA DE CARRITO GLOBAL ----------------

function actualizarContadorHeader() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const enlaceCarrito = document.querySelector('.nav-link-carrito');
    if (enlaceCarrito) {
        enlaceCarrito.innerHTML = `Carrito <img src="images/icons/shopping-bag.png" alt="icono carrito"> (${totalItems})`;
    }
}

function obtenerCarritoGlobal() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarritoGlobal(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorHeader();
}

// ---------------- INICIALIZACIÓN ----------------

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado, inicializando aplicación...');

    try {
        const registros = await obtenerTodosLosProductos();

        misProductos = registros.map(record => {
            const fields = record.fields;

            const titulo = fields.título || fields.titulo || fields.Título || fields.Titulo || fields.title || fields.Name || fields.nombre || "Producto sin título";
            const descripcion = fields.descripción || fields.descripcion || fields.Descripción || fields.Descripcion || fields.description || "";
            const caracteristicas = fields.características || fields.caracteristicas || fields.Características || fields.Caracteristicas || "";
            const imagen = fields.imagen || fields.Imagen || fields.image || fields.Image || fields.foto || "images/Products/default-product.jpg";
            const precio = fields.precio || fields.Precio || fields.price || fields.Price || "0";
            const stock = fields.stock || fields.Stock || 0;
            const categoria = fields.categoria || fields.Categoria || 0; // Añadido

            return {
                id: record.id,
                imagen: imagen,
                precio: precio,
                precioFormateado: formatearPrecio(precio),
                titulo: titulo,
                descripcion: descripcion,
                caracteristicas: caracteristicas,
                stock: stock,
                categoria: categoria, // Añadido
                envio: "Envío a toda la capital"
            };
        });

        console.log('Total de productos obtenidos:', misProductos.length);

        sessionStorage.setItem('todosLosProductos', JSON.stringify(misProductos));

        // Filtrar productos según la URL y activar links
        filtrarYActivarLinks();

    } catch (error) {
        console.error('Error al cargar todos los productos desde Airtable:', error);
        if (document.querySelector('.product-container')) {
            mostrarErrorProductos();
        }
    }

    actualizarContadorHeader();
    checkLoginStatus();
});