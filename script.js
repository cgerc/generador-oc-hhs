function formatearMoneda(n) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputFecha').valueAsDate = new Date();
    document.getElementById('dispFecha').innerText = new Date().toLocaleDateString('es-CL');

    // === PROVEEDORES ===
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSQ0W7Yhu123yENGAHaV5Ok-yX5DkPO_7orj9rydaVbI_f4DDQN41MPc7nuGSIkaO_-vBeRnM2rF9SR/pub?output=csv')

        .then(r => r.text())
        .then(csv => {
            const lineas = csv.split('\n').map(l => l.trim()).filter(l => l);
            const data = {};

            for (let i = 1; i < lineas.length; i++) {
                const c = lineas[i].split(',').map(x => x.replace(/^"|"$/g, '').trim());
                const clase = c[0];
                const razon = c[1];
                const rut = c[2] || '';
                const dir = c[3] || '';
                if (clase && razon) data[clase] = { razon, rut, dir };
            }

            // Dropdown RAZÓN SOCIAL
            const selProv = document.getElementById('inputProveedor');
            selProv.innerHTML = '<option value="">Selecciona Razón Social</option>';
            Object.keys(data).sort().forEach(clase => {
                const opt = document.createElement('option');
                opt.value = clase;
                opt.textContent = data[clase].razon;   // ← muestra Razón Social
                selProv.appendChild(opt);
            });
            selProv.onchange = () => {
                const p = data[selProv.value];
                if (p) {
                    document.getElementById('dispProv').textContent = p.razon;
                    document.getElementById('inputRutProv').value = p.rut;
                    document.getElementById('inputDireccion').value = p.dir;
                    document.getElementById('dispRut').textContent = p.rut;
                    document.getElementById('dispDir').textContent = p.dir;
                }
            };

            // Dropdown CLASE (para ítems)
            const selClase = document.getElementById('newClase');
            selClase.innerHTML = '<option value="">Clase</option>';
            Object.keys(data).sort().forEach(clase => {
                const opt = document.createElement('option');
                opt.value = clase;
                opt.textContent = clase;   // ← muestra solo la Clase
                selClase.appendChild(opt);
            });
        });

    // === OBRAS ===
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSQ0W7Yhu123yENGAHaV5Ok-yX5DkPO_7orj9rydaVbI_f4DDQN41MPc7nuGSIkaO_-vBeRnM2rF9SR/pub?gid=1397970288&single=true&output=csv')
        .then(r => r.text())
        .then(csv => {
            const lineas = csv.split('\n').map(l => l.trim()).filter(l => l);
            const selObra = document.getElementById('inputObraSelect');
            selObra.innerHTML = '<option value="">Selecciona la obra...</option>';
            for (let i = 1; i < lineas.length; i++) {
                const nombre = lineas[i].split(',')[0].replace(/^"|"$/g, '').trim();
                if (nombre && nombre !== "Obras") {
                    const opt = document.createElement('option');
                    opt.value = nombre;
                    opt.textContent = nombre;
                    selObra.appendChild(opt);
                }
            }
            selObra.onchange = () => {
                const obra = selObra.value;
                document.getElementById('inputObra').value = obra;
                document.getElementById('dispObra').textContent = obra;
            };
        });
});

// Ítems y tabla (igual)
let items = [];
function agregarItem() {
    const clase = document.getElementById('newClase').value;
    const desc = document.getElementById('newDesc').value.trim();
    const cant = parseFloat(document.getElementById('newQty').value) || 0;
    const precio = parseFloat(document.getElementById('newPrice').value) || 0;
    if (!clase || !desc) return alert("Faltan datos");
    items.push({ clase, desc, cant, precio, total: cant * precio });
    renderizarTabla();
    document.getElementById('newDesc').value = "";
    document.getElementById('newQty').value = "";
    document.getElementById('newPrice').value = "";
}
function renderizarTabla() {
    const tbody = document.getElementById('tablaCuerpo');
    tbody.innerHTML = "";
    let neto = 0;
    items.forEach(i => {
        neto += i.total;
        tbody.innerHTML += `<tr><td>${i.clase}</td><td>${i.desc}</td><td>UN</td><td>${i.cant}</td><td>${formatearMoneda(i.precio)}</td><td>${formatearMoneda(i.total)}</td></tr>`;
    });
    const iva = neto * 0.19;
    document.getElementById('totalNeto').textContent = formatearMoneda(neto);
    document.getElementById('totalIva').textContent = formatearMoneda(iva);
    document.getElementById('totalFinal').textContent = formatearMoneda(neto + iva);
}