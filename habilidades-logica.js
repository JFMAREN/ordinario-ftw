let catalogoHabilidades = [];

fetch('habilidades.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("habilidad");

        catalogoHabilidades = [];

        for (let i = 0; i < nodos.length; i++) {
            catalogoHabilidades.push({
                nombre: nodos[i].getElementsByTagName("nombre")[0].textContent,
                tipo: nodos[i].getElementsByTagName("tipo")[0].textContent,
                costo: nodos[i].getElementsByTagName("costo")[0].textContent,
                descripcion: nodos[i].getElementsByTagName("descripcion")[0].textContent
            });
        }
        
        renderizarTabla(catalogoHabilidades);
    })
    .catch(error => console.error("Error crítico leyendo habilidades.xml:", error));

function renderizarTabla(datos) {
    let tbody = document.querySelector("#tablaHabilidades tbody");
    tbody.innerHTML = ""; 

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#555;">No se encontraron registros bajo esta categoría.</td></tr>`;
        return;
    }

    datos.forEach(h => {
        tbody.innerHTML += `
            <tr>
                <td class="celda-nombre">${h.nombre}</td>
                <td class="celda-tipo">${h.tipo}</td>
                <td class="celda-costo">${h.costo}</td>
                <td class="celda-desc">${h.descripcion}</td>
            </tr>
        `;
    });
}

function filtrarHabilidades(categoria) {
    if (categoria === 'TODAS') {
        renderizarTabla(catalogoHabilidades);
    } else {
        let filtradas = catalogoHabilidades.filter(h => h.tipo.includes(categoria));
        renderizarTabla(filtradas);
    }
}