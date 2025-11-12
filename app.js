// ---------------- CONFIGURACIÓN DE AIRTABLE ----------------
const AIRTABLE_TOKEN = 'pat8tLFZBFuxZGFpv.936b0a3bb0fb9a97d7b04e2faa8d46d3c1af8269784a5170f5cf34a06b9206f2';
const AIRTABLE_BASE_ID = 'appQAusygx01OOuTl';
const AIRTABLE_TABLE_NAME = 'Productos';

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

// Obtener productos desde Airtable
async function obtenerProductosDesdeAirtable() {
    try {
        console.log('Obteniendo productos desde Airtable...');
        const response = await fetch(AIRTABLE_URL, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_TOKEN}`
            }
        });

        if (!response.ok) throw new Error(`Error al obtener productos: ${response.status}`);

        const data = await response.json();
        console.log('Datos recibidos de Airtable:', data);
        
        misProductos = data.records.map(record => {
            const fields = record.fields;
            const titulo = fields.título || fields.titulo || fields.Título || fields.Titulo || fields.title || fields.Name || fields.nombre || "Producto sin título";
            const descripcion = fields.descripción || fields.descripcion || fields.Descripción || fields.Descripcion || fields.description || "";
            const caracteristicas = fields.características || fields.caracteristicas || fields.Características || fields.Caracteristicas || fields.features || "";
            const imagen = fields.imagen || fields.Imagen || fields.image || fields.Image || fields.foto || "images/Products/default-product.jpg";
            const precio = fields.precio || fields.Precio || fields.price || fields.Price || "0";
            
            return {
                id: record.id,
                imagen,
                precio,
                precioFormateado: formatearPrecio(precio),
                titulo,
                descripcion,
                caracteristicas,
                enlace: "producto.html",
                envio: "Envio a toda la capital"
            };
        });

        crearProductosDesdeArray(misProductos);
        
    } catch (error) {
        console.error('Error al cargar productos desde Airtable:', error);
        mostrarErrorProductos();
    }
}

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
                <p>No se encontraron productos</p>
            </div>
        `;
        return;
    }
    
    productos.forEach((producto) => {
        const newProduct = document.createElement('a');
        newProduct.href = producto.enlace || "producto.html";
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

// ---------------- BUSCADOR ----------------

const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase().trim();
        
        if (searchText === '') {
            crearProductosDesdeArray(misProductos);
        } else {
            const filteredProducts = filterProducts(searchText);
            crearProductosDesdeArray(filteredProducts);
        }

        mostrarSugerencias(searchText);
    });
}

function filterProducts(text) {
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
            crearProductosDesdeArray([p]);
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

// ---------------- INICIALIZACIÓN ----------------

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado, inicializando aplicación (modo paginación)...');

    try {
        // Obtener TODOS los productos
        const registros = await obtenerTodosLosProductos();

        
        misProductos = registros.map(record => {
            const fields = record.fields;

            const titulo = fields.título || fields.titulo || fields.Título || fields.Titulo || fields.title || fields.Name || fields.nombre || "Producto sin título";
            const descripcion = fields.descripción || fields.descripcion || fields.Descripción || fields.Descripcion || fields.description || "";
            const caracteristicas = fields.características || fields.caracteristicas || fields.Características || fields.Caracteristicas || "";
            const imagen = fields.imagen || fields.Imagen || fields.image || fields.Image || fields.foto || "images/Products/default-product.jpg";
            const precio = fields.precio || fields.Precio || fields.price || fields.Price || "0";

            return {
                id: record.id,
                imagen: imagen,
                precio: precio,
                precioFormateado: formatearPrecio(precio),
                titulo: titulo,
                descripcion: descripcion,
                caracteristicas: caracteristicas,
                enlace: "producto.html",
                envio: "Envío a toda la capital"
            };
        });

        console.log('Total de productos obtenidos:', misProductos.length);
        crearProductosDesdeArray(misProductos);

    } catch (error) {
        console.error('Error al cargar todos los productos desde Airtable:', error);
        mostrarErrorProductos();
    }

    // Actualizar contador del carrito si existe
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
});
