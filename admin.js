// -------------------AIRTABLE-------------------------
const ADMIN_AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const ADMIN_AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const ADMIN_AIRTABLE_TABLE_NAME = AIRTABLE_CONFIG.TABLE_NAME;
const ADMIN_AIRTABLE_URL = `https://api.airtable.com/v0/${ADMIN_AIRTABLE_BASE_ID}/${ADMIN_AIRTABLE_TABLE_NAME}`;

const adminHeaders = {
    'Authorization': `Bearer ${ADMIN_AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json'
};

// ---------- referencias de DOM ---------------------------
const form = document.getElementById('form-producto');
const record_id_input = document.getElementById('record_id');
const titulo_input = document.getElementById('titulo');
const precio_input = document.getElementById('precio');
const stock_input = document.getElementById('stock');
const categoria_input = document.getElementById('categoria');
const descripcion_input = document.getElementById('descripcion');
const caracteristicas_input = document.getElementById('caracteristicas');
const imagen_input = document.getElementById('imagen');
const btnGuardar = document.getElementById('btn-guardar');
const btnNuevo = document.getElementById('btn-nuevo');
const tablaProductos = document.getElementById('tabla-productos');

// ----------------Inicializacion--------------------------
document.addEventListener('DOMContentLoaded', () => {
    if (form) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            
            window.location.href = 'index.html';
            return;
        }
        cargarProductosAdmin();
        
        form.addEventListener('submit', guardarProducto);
        btnNuevo.addEventListener('click', limpiarFormulario);
    }
});

// ------------Leer y mostrar productos-------------------------------
async function cargarProductosAdmin() {
    if (!tablaProductos) return;
    tablaProductos.innerHTML = `<tr><td colspan="5" style="text-align: center;">Cargando productos...</td></tr>`;

    try {
        const response = await fetch(ADMIN_AIRTABLE_URL, { headers: adminHeaders });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const data = await response.json();
        renderizarTabla(data.records);
    } catch (error) {
        console.error('Error al cargar productos (Admin):', error);
        tablaProductos.innerHTML = `<tr><td colspan="5">Error al cargar productos</td></tr>`;
    }
}

function renderizarTabla(records) {
    tablaProductos.innerHTML = '';
    if (records.length === 0) {
        tablaProductos.innerHTML = `<tr><td colspan="5">No hay productos</td></tr>`;
        return;
    }

    records.forEach(record => {
        const fields = record.fields;
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${fields.titulo || 'Sin título'}</td>
            <td>$${fields.precio || 0}</td>
            <td>${fields.stock || 0}</td>
            <td>${fields.categoria || 0}</td>
            <td>
                <button class="btn-admin btn-edit" data-id="${record.id}">Editar</button>
                <button class="btn-admin btn-delete" data-id="${record.id}">Eliminar</button>
            </td>
        `;

        tr.querySelector('.btn-edit').addEventListener('click', () => popularFormulario(record));
        tr.querySelector('.btn-delete').addEventListener('click', () => eliminarProducto(record.id));
        
        tablaProductos.appendChild(tr);
    });
}

// -----------------Crear o Actualizar------------------------------
function popularFormulario(record) {
    record_id_input.value = record.id;
    const fields = record.fields;

    titulo_input.value = fields.titulo || '';
    precio_input.value = fields.precio || 0;
    stock_input.value = fields.stock || 0;
    categoria_input.value = fields.categoria || 0;
    descripcion_input.value = fields.descripcion || '';
    caracteristicas_input.value = fields.caracteristicas || '';
    imagen_input.value = fields.imagen || '';

    btnGuardar.textContent = 'Actualizar Producto';
    window.scrollTo(0, 0);
}

function limpiarFormulario() {
    form.reset();
    record_id_input.value = '';
    stock_input.value = 0;
    categoria_input.value = 0;
    btnGuardar.textContent = 'Agregar Producto';
}

async function guardarProducto(e) {
    e.preventDefault();

    const id = record_id_input.value;
    const esActualizacion = !!id;

    const url = esActualizacion ? `${ADMIN_AIRTABLE_URL}/${id}` : ADMIN_AIRTABLE_URL;
    const method = esActualizacion ? 'PATCH' : 'POST';

    const fields = {
        "titulo": titulo_input.value,
        "precio": parseFloat(precio_input.value) || 0,
        "stock": parseInt(stock_input.value) || 0,
        "categoria": parseInt(categoria_input.value) || 0,
        "descripcion": descripcion_input.value,
        "caracteristicas": caracteristicas_input.value,
        "imagen": imagen_input.value
    };

    const body = JSON.stringify({ fields });

    try {
        const response = await fetch(url, { method, headers: adminHeaders, body });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error.message}`);
        }

        
        limpiarFormulario();
        cargarProductosAdmin();

    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
}

// ------------eliminar producto-------------------------------
async function eliminarProducto(id) {
    

    const url = `${ADMIN_AIRTABLE_URL}/${id}`;

    try {
        const response = await fetch(url, { method: 'DELETE', headers: adminHeaders });
        if (!response.ok) throw new Error('No se pudo eliminar el registro.');

        
        cargarProductosAdmin();

    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}