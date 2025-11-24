function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(numero);
}

document.addEventListener('DOMContentLoaded', function() {
    // Fecha automática
    document.getElementById('inputFecha').valueAsDate = new Date();
    document.getElementById('dispFecha').innerText = new Date().toLocaleDateString('es-CL');

    // ==================== PROVEEDORES ====================
    fetch('/proxy-sheet')
        .then(r => r.text())
        .then(texto => {
            const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
            const proveedores = {};

            for (let i = 1; i < lineas.length; i++) {
                const cols = lineas[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
                const clase = cols[0];
                const razonSocial = cols[1];
                const rut = cols[2];
                const direccion = cols[3];
                if (clase && razonSocial) {
                    proveedores[clase] = { razonSocial, rut, direccion };
                }
            }

            // Dropdown proveedor → muestra Razón Social
            const selectProv = document.getElementById('inputProveedor');
            selectProv.innerHTML = '<option value="" disabled selected>Selecciona Razón Social...</option>';
            Object.keys(proveedores).sort().forEach(clase => {
                const opt = document.createElement('option');
                opt.value = clase;
                opt.textContent = proveedores[clase].razonSocial;
                selectProv.appendChild(opt);
            });

            selectProv.addEventListener('change', function() {
                const p = proveedores[this.value];
                if (p) {
                    document.getElementById('dispProv').innerText = p.razonSocial;
                    document.getElementById('inputRutProv').value = p.rut;
                    document.getElementById('inputDireccion').value = p.direccion;
                    document.getElementById('dispRut').innerText = p.rut;
                    document.getElementById('dispDir').innerText = p.direccion;
                }
            });

            // Dropdown ítems → solo Clase
            const selectItem = document.getElementById('newClase');
            selectItem.innerHTML = '<option value="" disabled selected>Clase</option>';
            Object.keys(proveedores).sort().forEach(clase => {
                const opt = document.createElement('option');
                opt.value = clase;
                opt.textContent = clase;
                selectItem.appendChild(opt);
            });
        })
        .catch(err => console.error("Error proveedores:", err));

    // ==================== OBRAS (solo nombre completo) ====================
    fetch('/proxy-obras')
        .then(r => r.text())
        .then(texto => {
            const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
            const select = document.getElementById('inputObraSelect');
            select.innerHTML = '<option value="">Selecciona la obra...</option>';

            for (let i = 1; i < lineas.length; i++) {
                const nombre = lineas[i].split(',')[0].replace(/^"|"$/g, '').trim();
                if (nombre && nombre !== "Obras") {  // evita que aparezca el título
                    const opt = document.createElement('option');
                    opt.value = nombre;
                    opt.textContent = nombre;
                    select.appendChild(opt);
                }
            }

            select.addEventListener('change', function() {
                const obra = this.value;
                document.getElementById('inputObra').value = obra;
                document.getElementById('dispObra').innerText = obra;
            });
        })
        .catch(err => console.error("Error cargando obras:", err));
});

// ==================== ÍTEMS Y TABLA ====================
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