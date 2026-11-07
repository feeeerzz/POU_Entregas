let inventario = [
    { id: 1, nombre: 'Cuaderno rayado', categoria: 'papeleria', cantidad: 40, precio: 1.25, agotado: false },
    { id: 2, nombre: 'Bolígrafo azul', categoria: 'papeleria', cantidad: 120, precio: 0.35, agotado: false },
    { id: 3, nombre: 'Resaltador amarillo', categoria: 'papeleria', cantidad: 0, precio: 0.9, agotado: true },
    { id: 4, nombre: 'Mouse inalámbrico', categoria: 'tecnologia', cantidad: 15, precio: 12.5, agotado: false },
    { id: 5, nombre: 'Audífonos', categoria: 'tecnologia', cantidad: 8, precio: 18.99, agotado: false },
    { id: 6, nombre: 'Cable USB-C', categoria: 'tecnologia', cantidad: 0, precio: 4.75, agotado: true },
    { id: 7, nombre: 'Lámpara de escritorio', categoria: 'hogar', cantidad: 6, precio: 22, agotado: false },
    { id: 8, nombre: 'Taza de cerámica', categoria: 'hogar', cantidad: 25, precio: 3.5, agotado: false }
];

const formulario = document.getElementById('formulario-producto');
const mensajeError = document.querySelector('#mensaje-error');
const filtroCategoria = document.getElementById('filtro-categoria');
const cuerpoInventario = document.getElementById('cuerpo-inventario');
const mensajeVacio = document.getElementById('mensaje-vacio');

function crearGeneradorId() {
    let contador = 100;
    return function () {
        contador = contador + 1;
        return contador;
    };
}

const generarId = crearGeneradorId();

function calcularValorTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total = total + items[i].cantidad * items[i].precio;
    }
    return total;
}

function contarUnidades(items) {
    let unidades = 0;
    for (let i = 0; i < items.length; i++) {
        unidades = unidades + items[i].cantidad;
    }
    return unidades;
}

function contarAgotados(items) {
    let agotados = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].agotado) {
            agotados = agotados + 1;
        }
    }
    return agotados;
}

function contarPorCategoria(items) {
    const conteo = {};
    for (let i = 0; i < items.length; i++) {
        const categoria = items[i].categoria;
        if (conteo[categoria] === undefined) {
            conteo[categoria] = 0;
        }
        conteo[categoria] = conteo[categoria] + 1;
    }
    return conteo;
}

function crearCelda(texto) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
}

function crearBoton(texto, clase, id) {
    const boton = document.createElement('button');
    boton.textContent = texto;
    boton.classList.add(clase);
    boton.setAttribute('data-id', id);
    return boton;
}

function crearFila(item) {
    const fila = document.createElement('tr');
    if (item.agotado) {
        fila.classList.add('agotado');
    } else {
        fila.classList.add('disponible');
    }

    fila.appendChild(crearCelda(item.nombre));
    fila.appendChild(crearCelda(item.categoria));
    fila.appendChild(crearCelda(item.cantidad));
    fila.appendChild(crearCelda('$' + item.precio.toFixed(2)));
    fila.appendChild(crearCelda('$' + (item.cantidad * item.precio).toFixed(2)));
    fila.appendChild(crearCelda(item.agotado ? 'Agotado' : 'Disponible'));

    const celdaAcciones = document.createElement('td');
    celdaAcciones.appendChild(crearBoton('Cambiar estado', 'btn-estado', item.id));
    celdaAcciones.appendChild(crearBoton('Eliminar', 'btn-eliminar', item.id));
    fila.appendChild(celdaAcciones);

    return fila;
}

// Los indicadores reflejan los productos visibles en la tabla, es decir, respetan el filtro seleccionado.
function renderizar(items) {
    cuerpoInventario.textContent = '';
    for (let i = 0; i < items.length; i++) {
        cuerpoInventario.appendChild(crearFila(items[i]));
    }

    document.getElementById('total-productos').textContent = items.length;
    document.getElementById('total-unidades').textContent = contarUnidades(items);
    document.getElementById('valor-total').textContent = '$' + calcularValorTotal(items).toFixed(2);
    document.getElementById('total-agotados').textContent = contarAgotados(items);

    mensajeVacio.hidden = items.length > 0;
}

function filtrarPorCategoria(categoria) {
    const resultado = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].categoria === categoria) {
            resultado[resultado.length] = inventario[i];
        }
    }
    return resultado;
}

function obtenerProductosVisibles() {
    if (filtroCategoria.value === 'todas') {
        return inventario;
    }
    return filtrarPorCategoria(filtroCategoria.value);
}

function llenarFiltroCategorias() {
    const seleccionActual = filtroCategoria.value;
    while (filtroCategoria.options.length > 1) {
        filtroCategoria.removeChild(filtroCategoria.lastChild);
    }

    const categorias = contarPorCategoria(inventario);
    for (const categoria in categorias) {
        const opcion = document.createElement('option');
        opcion.value = categoria;
        opcion.textContent = categoria;
        filtroCategoria.appendChild(opcion);
    }

    if (categorias[seleccionActual] !== undefined) {
        filtroCategoria.value = seleccionActual;
    } else {
        filtroCategoria.value = 'todas';
    }
}

function validarProducto(datos) {
    if (datos.nombre === '') {
        throw new Error('El nombre no puede estar vacío.');
    }
    if (datos.categoria === '') {
        throw new Error('La categoría no puede estar vacía.');
    }
    if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
        throw new Error('La cantidad debe ser un número entero mayor que cero.');
    }
    if (typeof datos.precio !== 'number' || isNaN(datos.precio) || datos.precio < 0) {
        throw new Error('El precio debe ser un número mayor o igual que cero.');
    }
}

function agregarProducto(event) {
    event.preventDefault();
    try {
        const datos = {
            nombre: formulario.elements.nombre.value.trim(),
            categoria: formulario.elements.categoria.value.trim().toLowerCase(),
            cantidad: Number(formulario.elements.cantidad.value),
            precio: parseFloat(formulario.elements.precio.value)
        };
        validarProducto(datos);

        const nuevoProducto = {
            id: generarId(),
            nombre: datos.nombre,
            categoria: datos.categoria,
            cantidad: datos.cantidad,
            precio: datos.precio,
            agotado: false
        };
        inventario[inventario.length] = nuevoProducto;
        console.log('Alta de producto:', nuevoProducto);

        mensajeError.textContent = '';
        llenarFiltroCategorias();
        renderizar(obtenerProductosVisibles());
        formulario.reset();
    } catch (error) {
        mensajeError.textContent = error.message;
        console.error('No se pudo agregar el producto: ' + error.message);
    }
}

function eliminarProducto(id) {
    const resultado = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id !== id) {
            resultado[resultado.length] = inventario[i];
        }
    }
    return resultado;
}

function cambiarEstado(id) {
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id === id) {
            inventario[i].agotado = !inventario[i].agotado;
            console.log('Cambio de estado: ' + inventario[i].nombre + ' ahora está ' + (inventario[i].agotado ? 'agotado' : 'disponible'));
        }
    }
}

function manejarClicTabla(event) {
    const boton = event.target;
    if (!boton.classList.contains('btn-estado') && !boton.classList.contains('btn-eliminar')) {
        return;
    }

    const id = Number(boton.getAttribute('data-id'));

    if (boton.classList.contains('btn-estado')) {
        cambiarEstado(id);
    } else {
        inventario = eliminarProducto(id);
        console.log('Baja de producto con id ' + id);
    }

    renderizar(obtenerProductosVisibles());
}

function manejarCambioFiltro() {
    renderizar(obtenerProductosVisibles());
}

renderizar(inventario);
llenarFiltroCategorias();

formulario.addEventListener('submit', agregarProducto);
cuerpoInventario.addEventListener('click', manejarClicTabla);
filtroCategoria.addEventListener('change', manejarCambioFiltro);

console.table(inventario);
console.table(contarPorCategoria(inventario));
