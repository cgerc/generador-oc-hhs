function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numero);
}

// Fecha automática de hoy
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inputFecha').valueAsDate = new Date();
    document.getElementById('dispFecha').innerText = new Date().toLocaleDateString('es-CL');

    // Genera el dropdown de clases si no existe (hard-coded para seguridad)
    const select = document.getElementById('inputProveedor');
    if (select && select.children.length <= 1) {
        const clases = ['OOCC', 'ANSUL', 'ASEO', 'CCDD', 'CERAMISTA', 'CIELO MODULAR', 'CLIMA', 'CORTINA ROLLO', 'CRISTALERO', 'EEMM', 'ELECTRICO', 'FLETES Y ESCOMBROS', 'GAS', 'HOJALATERO', 'HONORARIOS PROFESIONALES', 'IMPERMEABILIZACION', 'INCENDIO', 'INSTALADOR PAVIMENTOS ESPECIALES', 'INSTALADOR REVESTIMIENTO ESPECIALES', 'LETREROS', 'MUEBLISTA', 'OBRA GRUESA', 'PINTOR', 'SANITARIO', 'SC OOCC', 'ACEROS GASTRONOMICOS', 'ARTEFACTOS SANITARIOS', 'ILUMINACION', 'PAVIMENTOS Y REVESTIMIENTOS DE MUROS', 'PUERTAS', 'MATERIALES OBRA', 'ARRIENDO EQUIPOS Y ANDAMIOS', 'BOLETAS Y SEGUROS', 'CAJA CHICA', 'EEPP Y PREVENCION', 'GASTOS GENERALES', 'INSTALACIONES DE FAENAS', 'UTILIDADES'];
        clases.forEach(clase => {
            const option = document.createElement('option');
            option.value = clase;
            option.textContent = clase;
            select.appendChild(option);
        });
    }
});

// ====== CONEXIÓN CON TU GOOGLE SHEET (usa proxy para CORS) ======
const GOOGLE_SHEET_CSV_URL = "/proxy-sheet"; // Netlify lo maneja con netlify.toml

let proveedoresCache = null;

async function cargarProveedores() {
    if (proveedoresCache) return proveedoresCache;

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Error al cargar Sheet");
        const texto = await response.text();
        const lineas = texto.split("\n").filter(l => l.trim() !== "");

        const proveedores = {};
        const encabezados = lineas[0].split(",");
        
        for (let i = 1; i < lineas.length; i++) {
            let valores = lineas[i].split(",");
            valores = valores.map(v => v.replace(/"/g, "").trim());
            const clase = valores[0];
            if (clase) {
                proveedores[clase] = {
                    rut: valores[2] || "",
                    dir: valores[3] || ""
                };
            }
        }
        proveedoresCache = proveedores;
        console.log("Proveedores cargados:", Object.keys(proveedores).length);
        return proveedores;
    } catch (err) {
        console.error("Error cargando proveedores:", err);
        return {};
    }
}

// Evento del dropdown - conexión automática
document.getElementById('inputProveedor').addEventListener('change', async (e) => {
    const clase = e.target.value.trim();
    if (!clase) return;

    document.getElementById('dispProv').innerText = clase;

    const data = await cargarProveedores();
    const prov = data[clase];

    if (prov) {
        document.getElementById('inputRutProv').value = prov.rut;
        document.getElementById('inputDireccion').value = prov.dir;
        const dispRut = document.getElementById('dispRut');
        const dispDir = document.getElementById('dispDir');
        if (dispRut) dispRut.innerText = prov.rut;
        if (dispDir) dispDir.innerText = prov.dir;
        console.log("Proveedor cargado:", prov);
    } else {
        document.getElementById('inputRutProv').value = "";
        document.getElementById('inputDireccion').value = "";
        const dispRut = document.getElementById('dispRut');
        const dispDir = document.getElementById('dispDir');
        if (dispRut) dispRut.innerText = "";
        if (dispDir) dispDir.innerText = "";
        console.log("Clase no encontrada:", clase);
    }
});

// Resto del código original (agregarItem, renderizarTabla, etc.)
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

// Actualizaciones en tiempo real
document.getElementById('inputRutProv').addEventListener('input', (e) => {
    const dispRut = document.getElementById('dispRut');
    if (dispRut) dispRut.innerText = e.target.value;
});
document.getElementById('inputDireccion').addEventListener('input', (e) => {
    const dispDir = document.getElementById('dispDir');
    if (dispDir) dispDir.innerText = e.target.value;
});
document.getElementById('inputObra').addEventListener('input', (e) => {
    document.getElementById('dispObra').innerText = e.target.value;
});