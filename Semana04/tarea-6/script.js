const gastos = [
    { descripcion: 'Cuota mensual de la universidad', monto: 150, categoria: 'educacion' },
    { descripcion: 'Libro de programación', monto: 54.99, categoria: 'educacion' },
    { descripcion: 'Compra en el supermercado', monto: 62.35, categoria: 'alimentacion' },
    { descripcion: 'Pupusas del fin de semana', monto: 8.5, categoria: 'alimentacion' },
    { descripcion: 'Gasolina de la semana', monto: 35, categoria: 'transporte' },
    { descripcion: 'Cambio de llantas', monto: 120, categoria: 'transporte' },
    { descripcion: 'Entradas de cine', monto: 12, categoria: 'entretenimiento' },
    { descripcion: 'Suscripción de música', monto: 10.99, categoria: 'entretenimiento' }
];

const esNivelAlto = (nivel) => nivel === 'Alto';

const redondear = (valor) => Math.round(valor * 100) / 100;

function calcularTotal(gastos) {
    let total = 0;
    for (let i = 0; i < gastos.length; i++) {
        if (typeof gastos[i].monto !== 'number') {
            throw new Error('El monto del gasto "' + gastos[i].descripcion + '" no es un número.');
        }
        total = total + gastos[i].monto;
    }
    return total;
}

function calcularPromedio(gastos) {
    if (gastos.length === 0) {
        throw new Error('No se puede calcular el promedio porque no hay gastos registrados.');
    }
    return calcularTotal(gastos) / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {
    const gastosFiltrados = [];
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].categoria === categoria) {
            gastosFiltrados[gastosFiltrados.length] = gastos[i];
        }
    }
    return gastosFiltrados;
}

function obtenerMayorGasto(gastos) {
    if (gastos.length === 0) {
        return null;
    }
    let mayorGasto = gastos[0];
    for (let i = 1; i < gastos.length; i++) {
        if (gastos[i].monto > mayorGasto.monto) {
            mayorGasto = gastos[i];
        }
    }
    return mayorGasto;
}

function clasificarGasto(monto) {
    if (monto >= 100) {
        return 'Alto';
    } else if (monto >= 50 && monto < 100) {
        return 'Medio';
    } else {
        return 'Bajo';
    }
}

function describirCategoria(categoria) {
    switch (categoria) {
        case 'educacion':
            return 'Gastos de estudio y materiales';
        case 'alimentacion':
            return 'Comida y compras del hogar';
        case 'transporte':
            return 'Movilidad y mantenimiento del vehículo';
        case 'entretenimiento':
            return 'Ocio y suscripciones';
        default:
            return 'Categoría sin descripción';
    }
}

function crearContadorDeAltos() {
    let contador = 0;
    return function () {
        contador = contador + 1;
        return contador;
    };
}

try {
    const gastosClasificados = [];
    const contarGastoAlto = crearContadorDeAltos();
    let cantidadAltos = 0;

    for (let i = 0; i < gastos.length; i++) {
        const nivel = clasificarGasto(gastos[i].monto);
        gastosClasificados[gastosClasificados.length] = {
            descripcion: gastos[i].descripcion,
            monto: gastos[i].monto,
            categoria: gastos[i].categoria,
            nivel: nivel,
            descripcionCategoria: describirCategoria(gastos[i].categoria)
        };
        if (esNivelAlto(nivel)) {
            cantidadAltos = contarGastoAlto();
        }
    }

    console.log('INFORME DE GASTOS');
    console.log('Detalle de los gastos clasificados por nivel:');
    console.table(gastosClasificados);

    const total = calcularTotal(gastos);
    const promedio = calcularPromedio(gastos);
    console.log('Total gastado: $' + total.toFixed(2));
    console.log('Promedio por gasto: $' + promedio.toFixed(2));

    const mayorGasto = obtenerMayorGasto(gastos);
    console.log('Gasto más alto: ' + mayorGasto.descripcion + ' por $' + mayorGasto.monto.toFixed(2) + ' (categoría: ' + mayorGasto.categoria + ')');

    console.log('Cantidad de gastos altos (100 o más): ' + cantidadAltos);

    const categoriaElegida = gastos[0].categoria;
    const gastosDeCategoria = filtrarPorCategoria(gastos, categoriaElegida);
    console.log('Gastos de la categoría "' + categoriaElegida + '" (' + gastosDeCategoria.length + ' en total):', gastosDeCategoria);

    const resumenPorCategoria = {};
    for (let i = 0; i < gastos.length; i++) {
        const categoria = gastos[i].categoria;
        if (resumenPorCategoria[categoria] === undefined) {
            resumenPorCategoria[categoria] = 0;
        }
        resumenPorCategoria[categoria] = redondear(resumenPorCategoria[categoria] + gastos[i].monto);
    }

    const informe = {
        total: redondear(total),
        promedio: redondear(promedio),
        cantidadAltos: cantidadAltos,
        mayorGasto: mayorGasto,
        resumenPorCategoria: resumenPorCategoria
    };
    console.log('Informe final en formato JSON:');
    console.log(JSON.stringify(informe, null, 2));
} catch (error) {
    console.error('Ocurrió un error al procesar los gastos: ' + error.message);
}

try {
    console.log('PRUEBA CONTROLADA DE ERROR');
    console.log('Se intenta calcular el promedio de una lista vacía...');
    calcularPromedio([]);
} catch (error) {
    console.error('Error capturado en la prueba controlada: ' + error.message);
}
