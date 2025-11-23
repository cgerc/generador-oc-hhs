// ====== CONEXIÓN CON TU GOOGLE SHEET (cambia solo esta línea) ======
const GOOGLE_SHEET_CSV_URL = "PEGA-AQUÍ-TU-ENLACE-CSV-PÚBLICO";

// Cache para que sea rapidísimo después de la primera carga
let proveedoresCache = null;

async function cargarProveedores() {
    if (proveedoresCache) return proveedoresCache;

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL + "&t=" + Date.now()); // evita caché
        const texto = await response.text();
        const lineas = texto.split("\n").map(l => l.trim()).filter(l => l);

        const proveedores = {};
        const encabezados = lineas[0].split(",");

        for (let i = 1; i < lineas.length; i++) {
            // Maneja comas dentro de comillas correctamente
            const valores = lineas[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            const valoresLimpios = valores.map(v => v.replace(/^"|"$/g, "").trim());

            const clase = valoresLimpios[0];
            if (clase) {
                proveedores[clase] = {
                    rut: valoresLimpios[2] || "",
                    dir: valoresLimpios[3] || ""
                };
            }
        }
        proveedoresCache = proveedores;
        return proveedores;
    } catch (err) {
        console.error("Error cargando proveedores:", err);
        return {};
    }
}

// ====== CUANDO SELECCIONA UNA CLASE EN EL DROPDOWN ======
document.getElementById('inputProveedor').addEventListener('change', async (e) => {
    const clase = e.target.value.trim();
    if (!clase) return;

    // Muestra la clase seleccionada
    document.getElementById('dispProv').innerText = clase;

    // Carga los datos del Sheet
    const data = await cargarProveedores();
    const prov = data[clase];

    if (prov) {
        // Rellena los campos automáticamente
        document.getElementById('inputRutProv').value = prov.rut;
        document.getElementById('inputDireccion').value = prov.dir;

        // También actualiza los que se ven en la OC (si tienes estos IDs)
        const dispRut = document.getElementById('dispRut');
        const dispDir = document.getElementById('dispDir');
        if (dispRut) dispRut.innerText = prov.rut;
        if (dispDir) dispDir.innerText = prov.dir;
    } else {
        // Si no encuentra la clase, limpia los campos
        document.getElementById('inputRutProv').value = "";
        document.getElementById('inputDireccion').value = "";
        if (document.getElementById('dispRut')) document.getElementById('dispRut').innerText = "";
        if (document.getElementById('dispDir')) document.getElementById('dispDir').innerText = "";
    }
});