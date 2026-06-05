fetch('arquetipos.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("arquetipo");
        let contenedor = document.getElementById("listaCompleta");

        contenedor.innerHTML = "";

        for (let i = 0; i < nodos.length; i++) {
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let linaje = nodos[i].getElementsByTagName("linaje")[0].textContent;
            let imagen = nodos[i].getElementsByTagName("imagen")[0].textContent;
            contenedor.innerHTML += `
                <div class="tarjeta-compendio">
                    <div class="marco-mini">
                        <img src="${imagen}" alt="${nombre}">
                    </div>
                    <h3>${nombre}</h3>
                    <p>Linaje: ${linaje}</p>
                </div>
            `;
        }
    })
    .catch(error => console.error("Error al cargar el Códice:", error));