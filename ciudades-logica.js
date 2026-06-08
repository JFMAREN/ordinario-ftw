class CiudadDTO {
    constructor(id, nombre, tipo, region, imagen, descripcion) {
        this.id = String(id);
        this.nombre = String(nombre);
        this.tipo = String(tipo);
        this.region = String(region);
        this.imagen = String(imagen);
        this.descripcion = String(descripcion);
    }
}

let listaCiudadesMetaphor = [];

fetch('ciudades.xml')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo enlazar el archivo ciudades.xml");
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("ciudad");

        listaCiudadesMetaphor = [];

        for (let i = 0; i < nodos.length; i++) {
            let id = nodos[i].getElementsByTagName("id")[0].textContent;
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let tipo = nodos[i].getElementsByTagName("tipo")[0].textContent;
            let region = nodos[i].getElementsByTagName("region")[0].textContent;
            let imagen = nodos[i].getElementsByTagName("imagen")[0].textContent;
            let descripcion = nodos[i].getElementsByTagName("descripcion")[0].textContent;
            let ciudadDto = new CiudadDTO(id, nombre, tipo, region, imagen, descripcion);
            listaCiudadesMetaphor.push(ciudadDto);
        }

        renderizarTablaCiudades(listaCiudadesMetaphor);
    })
    .catch(error => console.error("Error crítico procesando mapa de Euchronia:", error));

function renderizarTablaCiudades(datos) {
    let tbody = document.querySelector("#tablaCiudadesMetaphor tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#555;">No hay registros cartográficos para esta categoría.</td></tr>`;
        return;
    }

    datos.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td class="celda-avatar-tabla">
                    <img src="${c.imagen}" alt="Postal oficial e ilustración de la ciudad de ${c.nombre}" class="avatar-personaje-tabla">
                </td>
                <td class="celda-nombre">${c.nombre}</td>
                <td class="celda-tipo">${c.tipo}</td>
                <td class="celda-costo">${c.region}</td>
                <td class="celda-desc"><em>${c.descripcion}</em></td>
            </tr>
        `;
    });
}

function filtrarCiudades(tipoElegido) {
    if (tipoElegido === 'TODOS') {
        renderizarTablaCiudades(listaCiudadesMetaphor);
    } else {
        let filtrados = listaCiudadesMetaphor.filter(c => c.tipo === tipoElegido);
        renderizarTablaCiudades(filtrados);
    }
}