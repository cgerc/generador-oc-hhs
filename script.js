function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numero);
}

// Actualizar datos del encabezado en tiempo real
document.getElementById('inputProveedor').addEventListener('input', (e) => document.getElementById('dispProv').innerText = e.target.value);
document.getElementById('inputRutProv').addEventListener('input', (e) => document.getElementById('dispRut').innerText = e.target.value);
document.getElementById('inputDireccion').addEventListener('input', (e) => document.getElementById('dispDir').innerText = e.target.value);
document.getElementById('inputObra').addEventListener('input', (e) => document.getElementById('dispObra').innerText = e.target.value);
document.getElementById('inputFecha').addEventListener('change', (e) => document.getElementById('dispFecha').innerText = e.target.value);

let items = [];

function agregarItem() {
    const codigo = document.getElementById('newCode').value;
    const desc = document.getElementById('newDesc').value;
    const cant = parseFloat(document.getElementById('newQty').value) || 0;
    const precio = parseFloat(document.getElementById('newPrice').value) || 0;
    const total = cant * precio;

    if (desc === "") return alert("Ingresa una descripción");

    items.push({ codigo, desc, cant, precio, total });
    renderizarTabla();
    
    // Limpiar inputs
    document.getElementById('newDesc').value = "";
    document.getElementById('newPrice').value = "";
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaCuerpo');
    tbody.innerHTML = "";
    let sumaNeto = 0;

    items.forEach((item) => {
        sumaNeto += item.total;
        tbody.innerHTML += `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.desc}</td>
                <td>UN</td>
                <td>${item.cant}</td>
                <td>${formatearMoneda(item.precio)}</td>
                <td>${formatearMoneda(item.total)}</td>
            </tr>
        `;
    });

    const iva = sumaNeto * 0.19;
    const totalFinal = sumaNeto + iva;

    document.getElementById('totalNeto').innerText = formatearMoneda(sumaNeto);
    document.getElementById('totalIva').innerText = formatearMoneda(iva);
    document.getElementById('totalFinal').innerText = formatearMoneda(totalFinal);
}