class HabilidadDTO {
    constructor(nombre, tipo, costo, descripcion) {
        this.nombre = String(nombre);
        this.tipo = String(tipo);
        this.costo = String(costo);
        this.descripcion = String(descripcion);
    }
}

let catalogoHabilidades = [];

fetch('habilidades.xml')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo enlazar el archivo habilidades.xml");
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("habilidad");

        catalogoHabilidades = [];

        for (let i = 0; i < nodos.length; i++) {
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let tipo = nodos[i].getElementsByTagName("tipo")[0].textContent;
            let costo = nodos[i].getElementsByTagName("costo")[0].textContent;
            let descripcion = nodos[i].getElementsByTagName("descripcion")[0].textContent;
            
            let habilidadDto = new HabilidadDTO(nombre, tipo, costo, descripcion);
            catalogoHabilidades.push(habilidadDto);
        }
        
        renderizarTablaHabilidades(catalogoHabilidades);
    })
    .catch(error => console.error("Error crítico leyendo habilidades.xml:", error));

function renderizarTablaHabilidades(datos) {
    let tbody = document.querySelector("#tablaHabilidades tbody");
    if (!tbody) return;
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
    if (categoria === 'TODOS') {
        renderizarTablaHabilidades(catalogoHabilidades);
    } else {
        let filtradas = catalogoHabilidades.filter(h => 
            h.tipo.toLowerCase().includes(categoria.toLowerCase())
        );
        renderizarTablaHabilidades(filtradas);
    }
}