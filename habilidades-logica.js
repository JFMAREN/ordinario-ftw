fetch('xml/habilidades.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("habilidad");
        let tbody = document.querySelector("#tablaHabilidades tbody");

        tbody.innerHTML = ""; 

        for (let i = 0; i < nodos.length; i++) {
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let tipo = nodos[i].getElementsByTagName("tipo")[0].textContent;
            let costo = nodos[i].getElementsByTagName("costo")[0].textContent;
            let descripcion = nodos[i].getElementsByTagName("descripcion")[0].textContent;

            tbody.innerHTML += `
                <tr>
                    <td style="color: #d4af37; font-weight: bold;">${nombre}</td>
                    <td>${tipo}</td>
                    <td class="txt-cyan">${costo}</td>
                    <td style="color: #ccc;">${descripcion}</td>
                </tr>
            `;
        }
    })
    .catch(error => console.error("Error al procesar las habilidades:", error));