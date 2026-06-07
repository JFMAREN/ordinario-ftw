let listaAliadosMetaphor = [];
fetch('personajes.xml')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo enlazar el archivo personajes.xml");
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("personaje");

        listaAliadosMetaphor = [];

        for (let i = 0; i < nodos.length; i++) {
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let tribu = nodos[i].getElementsByTagName("tribu")[0].textContent;
            let arquetipo = nodos[i].getElementsByTagName("arquetipo_inicial")[0].textContent;
            let imagen = nodos[i].getElementsByTagName("imagen")[0].textContent;
            let descripcion = nodos[i].getElementsByTagName("descripcion")[0].textContent;

            listaAliadosMetaphor.push({ nombre, tribu, arquetipo, imagen, descripcion });
        }
        
        renderizarTablaAliados(listaAliadosMetaphor);
    })
    .catch(error => console.error("Error crítico procesando aliados de Euchronia:", error));

    function renderizarTablaAliados(datos) {
    let tbody = document.querySelector("#tablaAliadosMetaphor tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#555;">No hay crónicas registradas para esta tribu.</td></tr>`;
        return;
    }

    datos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td class="celda-avatar-tabla">
                    <img src="${p.imagen}" alt="Retrato oficial del aliado ${p.nombre} en la Wiki" class="avatar-personaje-tabla">
                </td>
                <td class="celda-nombre">${p.nombre}</td>
                <td class="celda-tipo">${p.tribu}</td>
                <td class="celda-costo">${p.arquetipo}</td>
                <td class="celda-desc"><em>${p.descripcion}</em></td>
            </tr>
        `;
    });
}

function filtrarAliados(tribuElegida) {
    if (tribuElegida === 'TODOS') {
        renderizarTablaAliados(listaAliadosMetaphor);
    } else {
        let filtrados = listaAliadosMetaphor.filter(p => p.tribu === tribuElegida);
        renderizarTablaAliados(filtrados);
    }
}