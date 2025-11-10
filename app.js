function crearProducto(imagenSrc, precio, titulo, enlace = "producto.html") {  //el codigo visto en clase para crear tarjetas, lo envolví en una función, para que al llamarla y pasarle atributos pueda crear las tarjetas, me pareció mas practico que usar arrays
    let products = document.querySelector('.product-container');
    
    let newProduct = document.createElement('a');
    newProduct.href = enlace;
    newProduct.className = "product-card";
    
    newProduct.innerHTML = `
        <img src="${imagenSrc}" alt="${titulo}">
        <div class="description">
            <span class="price">$${precio}</span>
            <span class="envio">Envio a toda la capital</span>
            <h3 class="product-description">${titulo}</h3>
        </div>
    `;
    
    products.appendChild(newProduct);
}

// Llamadas para crear TODAS tus tarjetas:
crearProducto("images/Products/pink-handbags.jpg", "151.499", "Cartera de Cuero Elegante");
crearProducto("images/Products/new-color-purse-luxury-handbag.jpg", "160.399", "Cartera de Cuero Elegante");
crearProducto("images/Products/color-purple-elegance-woman-luxury.jpg", "179.499", "Cartera de Cuero Elegante");
crearProducto("images/Products/beautiful-elegance-luxury-fashion-women-bag.jpg", "110.000", "Cartera de Cuero Elegante");
crearProducto("images/Products/suitcase-with-wheels-outdoors.jpg", "210.00", "Maleta rígida color celeste");
crearProducto("images/Products/side-view-traveler-with-suitcase.jpg", "220.500", "Maleta rígida color rosa");
crearProducto("images/Products/graphic-woman-dress-trendy-design-white-background.jpg", "90.100", "Vestido de Mujer Elegante");
crearProducto("images/Products/fashion-woman-with-clothes.jpg", "85.000", "Vestido de Mujer Elegante");
crearProducto("images/Products/picture-black-dress-with-red-flowers-it.jpg", "87.600", "Vestido de Mujer Elegante");
crearProducto("images/Products/beautiful-bridesmaids-dresses-hangers.jpg", "89.200", "Vestido de Mujer Elegante");