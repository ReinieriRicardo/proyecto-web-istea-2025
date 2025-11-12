// Productos a mostrar
const misProductos = [
    {
        imagen: "images/Products/pink-handbags.jpg",
        precio: "151.499",
        titulo: "Cartera de Cuero Elegante",
        descripcion: "Esta cartera de cuero elegante está diseñada para mujeres que buscan sofisticación y practicidad. Confeccionada con cuero genuino de alta calidad, cuenta con múltiples compartimentos internos, cierre metálico reforzado y correa ajustable.",
        caracteristicas: "Material: Cuero genuino|Dimensiones: 28 cm x 18 cm x 12 cm|Incluye correa ajustable|Garantía: 12 meses"
    },
    {
        imagen: "images/Products/new-color-purse-luxury-handbag.jpg",
        precio: "160.399",
        titulo: "Cartera de Cuero Elegante",
        descripcion: "Cartera de cuero de lujo con diseño moderno y funcional. Perfecta para el uso diario, con espacio organizado para todos tus esenciales.",
        caracteristicas: "Material: Cuero genuino|Dimensiones: 25 cm x 15 cm x 10 cm|Compartimento para celular|Cierre magnético|Garantía: 12 meses"
    },
    {
        imagen: "images/Products/color-purple-elegance-woman-luxury.jpg",
        precio: "179.499",
        titulo: "Cartera de Cuero Elegante",
        descripcion: "Elegante cartera en tonos púrpura, ideal para ocasiones especiales. Combina estilo y funcionalidad con su diseño sofisticado.",
        caracteristicas: "Material: Cuero premium|Dimensiones: 30 cm x 20 cm x 15 cm|Correa ajustable y extraíble|Multiple organizadores internos|Garantía: 12 meses"
    },
    {
        imagen: "images/Products/beautiful-elegance-luxury-fashion-women-bag.jpg",
        precio: "110.000",
        titulo: "Cartera de Cuero Elegante",
        descripcion: "Cartera elegante con diseño clásico atemporal. Perfecta para complementar cualquier outfit con su estilo refinado.",
        caracteristicas: "Material: Cuero sintético de alta calidad|Dimensiones: 26 cm x 16 cm x 8 cm|Bolsillo interno con cierre|Correa de mano|Garantía: 6 meses"
    },
    {
        imagen: "images/Products/suitcase-with-wheels-outdoors.jpg",
        precio: "210.000",
        titulo: "Maleta rígida color celeste",
        descripcion: "Maleta rígida ideal para viajes, con ruedas multidireccionales y sistema de bloqueo de seguridad. Diseño moderno y resistente.",
        caracteristicas: "Material: Policarbonato|Dimensiones: 55 cm x 35 cm x 25 cm|4 ruedas multidireccionales|Sistema TSA lock|Garantía: 24 meses"
    },
    {
        imagen: "images/Products/side-view-traveler-with-suitcase.jpg",
        precio: "220.500",
        titulo: "Maleta rígida color rosa",
        descripcion: "Maleta de viaje en color rosa con diseño ergonómico y sistema de ruedas suaves para fácil transporte en cualquier terreno.",
        caracteristicas: "Material: ABS resistente|Dimensiones: 60 cm x 40 cm x 20 cm|Ruedas silenciosas 360°|Asa telescópica ajustable|Garantía: 24 meses"
    },
    {
        imagen: "images/Products/graphic-woman-dress-trendy-design-white-background.jpg",
        precio: "90.100",
        titulo: "Vestido de Mujer Elegante",
        descripcion: "Vestido elegante para ocasiones especiales. Corte favorecedor y tela de alta calidad que asegura comodidad y estilo.",
        caracteristicas: "Material: Poliéster y elastano|Lavable a máquina|Talles: S, M, L, XL|Color: Negro|Ocasión: Fiesta y eventos"
    },
    {
        imagen: "images/Products/fashion-woman-with-clothes.jpg",
        precio: "85.000",
        titulo: "Vestido de Mujer Elegante",
        descripcion: "Vestido moderno con diseño contemporáneo. Ideal para el día a día o reuniones informales, ofrece comodidad y estilo.",
        caracteristicas: "Material: Algodón y viscosa|Lavable a máquina|Talles: XS, S, M, L|Color: Azul marino|Estilo: Casual"
    },
    {
        imagen: "images/Products/picture-black-dress-with-red-flowers-it.jpg",
        precio: "87.600",
        titulo: "Vestido de Mujer Elegante",
        descripcion: "Hermoso vestido negro con estampado de flores rojas. Diseño femenino y romántico perfecto para ocasiones especiales.",
        caracteristicas: "Material: Seda sintética|Lavado a mano recomendado|Talles: S, M, L|Estampado: Flores rojas|Ocasión: Eventos formales"
    },
    {
        imagen: "images/Products/beautiful-bridesmaids-dresses-hangers.jpg",
        precio: "89.200",
        titulo: "Vestido de Mujer Elegante",
        descripcion: "Vestido elegante para dama de honor o eventos formales. Diseño sofisticado que realza la silueta femenina.",
        caracteristicas: "Material: Gasas y encajes|Lavado en seco|Talles: S, M, L, XL|Color: Lila|Ocasión: Bodas y eventos formales"
    }
];

// ----------------FUNCIONES---------------

// ---------------BUSCADOR---------------

const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase().trim();
    
    if (searchText === '') {
        crearProductosDesdeArray(misProductos);
    } else {
        const filteredProducts = filterProducts(searchText);
        crearProductosDesdeArray(filteredProducts);
    }

    // sugerencias
    mostrarSugerencias(searchText);
});

function crearProductosDesdeArray(productos) {
    let products = document.querySelector('.product-container');
    products.innerHTML = '';
    
    productos.forEach(producto => {
        let newProduct = document.createElement('a');
        newProduct.href = producto.enlace || "producto.html";
        newProduct.className = "product-card";
        
        newProduct.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <div class="description">
                <span class="price">$${producto.precio}</span>
                <span class="envio">${producto.envio || "Envio a toda la capital"}</span>
                <h3 class="product-description">${producto.titulo}</h3>
            </div>
        `;
        
        products.appendChild(newProduct);
    });
}

function filterProducts(text) {
    return misProductos.filter(product => 
        product.titulo.toLowerCase().includes(text.toLowerCase())
    );
}

// Crear productos iniciales
crearProductosDesdeArray(misProductos);

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
        p.titulo.toLowerCase().includes(texto)
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

// ocultar sugerencias al hacer click fuera
document.addEventListener('click', (e) => {
    const sugerencias = document.querySelector('.search-suggestions');
    const barra = document.querySelector('.search-bar');
    if (sugerencias && !barra.contains(e.target)) {
        sugerencias.style.display = 'none';
    }
});
