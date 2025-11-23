function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numero);
}

// Fecha automática de hoy
document.getElementById('inputFecha').valueAsDate = new Date();
document.getElementById('dispFecha').innerText = new Date().toLocaleDateString('es-CL');

// Lista de clases
const clases = [
    "OOCC","ANSUL","ASEO","CCDD","CERAMISTA","CIELO MODULAR","CLIMA","CORTINA ROLLO","CRISTALERO",
    "EEMM","ELECTRICO","FLETES Y ESCOMBROS","GAS","HOJALATERO","HONORARIOS PROFESIONALES",
    "IMPERMEABILIZACION","INCENDIO","INSTALADOR PAVIMENTOS ESPECIALES","INSTALADOR REVESTIMIENTO ESPECIALES",
    "LETREROS","MUEBLISTA","OBRA GRUESA","PINTOR","SANITARIO","SC OOCC","ACEROS GASTRONOMICOS",
    "ARTEFACTOS SANITARIOS","ILUMINACION","PAVIMENTOS Y REVESTIMIENTOS DE MUROS","PUERTAS",
    "MATERIALES OBRA","ARRIENDO EQUIPOS Y ANDAMIOS","BOLETAS Y SEGUROS","CAJA CHICA",
    "EEPP Y PREVENCION","GASTOS GENERALES","INSTALACIONES DE FAENAS","UTILIDADES"
];

// Llenar ambos dropdowns
const selectProveedor = document.getElementById('inputProveedor');
const selectClase = document.getElementById('newClase');
clases.forEach(clase => {
    const opt1 = new Option(clase, clase);
    const opt2 = new Option(clase, clase);
    selectProveedor.add(opt1);
    selectClase.add(opt2);
});

// Actualizar campos en tiempo real
document.getElementById('inputProveedor').addEventListener('change', (e) => document.getElementById('dispProv').innerText = e.target.value);
document.getElementById('inputRutProv').addEventListener('input', (e) => document.getElementById('dispRut').innerText = e.target.value);
document.getElementById('inputDireccion').addEventListener('input', (e) => document.getElementById('dispDir').innerText = e.target.value);
document.getElementById('inputObra').addEventListener('input', (e) => document.getElementById('dispObra').innerText = e.target.value);
document.getElementById('inputNotas').addEventListener('input', (e) => {
    const extra = e.target.value ? '• ' + e.target.value.replace(/\n/g, '<br>• ') : '';
    document.getElementById('notasExtra').innerHTML = extra;
});

let items = [];

function agregarItem() {
    const clase = document.getElementById('newClase').value;
    const desc = document.getElementById('newDesc').value.trim();
    const cant = parseFloat(document.getElementById('newQty').value) || 0;
    const precio = parseFloat(document.getElementById('newPrice').value) || 0;

    if (!clase) return alert("Selecciona una Clase");
    if (!desc) return alert("Ingresa una descripción");

    items.push({ clase, desc, cant, precio, total: cant * precio });
    renderizarTabla();

    // Limpiar
    document.getElementById('newClase').value = "";
    document.getElementById('newDesc').value = "";
    document.getElementById('newQty').value = "";
    document.getElementById('newPrice').value = "";
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaCuerpo');
    tbody.innerHTML = "";
    let sumaNeto = 0;

    items.forEach(item => {
        sumaNeto += item.total;
        tbody.innerHTML += `
            <tr>
                <td>${item.clase}</td>
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