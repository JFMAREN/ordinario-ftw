class ArquetipoEnciclopediaDTO {
    constructor(id, nombre, linaje, fuerza, magia, agilidad, debilidad, imagen, descripcion) {
        this.id = String(id);
        this.nombre = String(nombre);
        this.linaje = String(linaje);
        this.fuerza = Number(fuerza);
        this.magia = Number(magia);
        this.agilidad = Number(agilidad);
        this.debilidad = String(debilidad);
        this.imagen = String(imagen);
        this.descripcion = String(descripcion);
    }
}

let arquetiposWiki = [];

fetch('arquetipos.xml')
    .then(response => {
        if (!response.ok) throw new Error("No se pudo recuperar el archivo XML de datos.");
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("arquetipo");

        let selector = document.getElementById("selectAgente");
        selector.innerHTML = '<option value="">-- Selecciona un Agente --</option>';

        for (let i = 0; i < nodos.length; i++) {
            let id = nodos[i].getElementsByTagName("id")[0].textContent;
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let linaje = nodos[i].getElementsByTagName("linaje")[0].textContent;
            let fuerza = nodos[i].getElementsByTagName("fuerza")[0].textContent;
            let magia = nodos[i].getElementsByTagName("magia")[0].textContent;
            let agilidad = nodos[i].getElementsByTagName("agilidad")[0].textContent;
            let debilidad = nodos[i].getElementsByTagName("elemento_debilidad")[0].textContent; 
            let imagen = nodos[i].getElementsByTagName("imagen")[0].textContent;
            let descripcion = nodos[i].getElementsByTagName("descripcion")[0].textContent;
            let arquetipoDto = new ArquetipoEnciclopediaDTO(id, nombre, linaje, fuerza, magia, agilidad, debilidad, imagen, descripcion);
            arquetiposWiki.push(arquetipoDto);

            let opcion = document.createElement("option");
            opcion.value = arquetipoDto.id;
            opcion.textContent = `${arquetipoDto.nombre} (${arquetipoDto.linaje})`;
            selector.appendChild(opcion);
        }
        console.log("Enciclopedia XML cargada con éxito mediante DTOs:", arquetiposWiki);
    })
    .catch(error => {
        console.error("Fallo crítico en la enciclopedia:", error);
        let selector = document.getElementById("selectAgente");
        if (selector) {
            selector.innerHTML = '<option value="">-- Error al cargar agentes --</option>';
        }
    });

document.getElementById("formCalculadora").addEventListener("submit", function(e) {
    e.preventDefault(); 

    let idSeleccionado = document.getElementById("selectAgente").value;
    let nivel = parseInt(document.getElementById("rngNivel").value);
    let tarjeta = document.getElementById("tarjetaResultado"); 

    if (!idSeleccionado) {
        alert("Por favor, selecciona un arquetipo primero.");
        return;
    }

    let agente = arquetiposWiki.find(a => a.id === idSeleccionado);

    if (agente) {
        let fuerzaProyectada = agente.fuerza + (nivel * 2); 
        let magiaProyectada = agente.magia + (nivel * 2);
        let agilidadProyectada = agente.agilidad + (nivel * 1.5);

        tarjeta.innerHTML = `
            <div class="resultado-agente" style="border: 1px solid gold; padding: 15px; margin-top: 15px; border-radius: 5px;">
                <h3>Proyección de Combate: ${agente.nombre} (${agente.linaje})</h3>
                
                <img src="${agente.imagen}" alt="Visualización del agente ${agente.nombre} para el cálculo proyectado de atributos de combate" style="width:120px; height:auto; margin: 10px 0;">
                
                <p><em>${agente.descripcion}</em></p>
                <hr style="border-color: #444;">
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Nivel Objetivo Proyectado:</strong> Rango ${nivel}</li>
                    <li><strong>Fuerza Total:</strong>  ${fuerzaProyectada}</li>
                    <li><strong>Magia Total:</strong>  ${magiaProyectada}</li>
                    <li><strong>Agilidad Total:</strong>  ${agilidadProyectada}</li>
                    <li><strong>Elemento de Debilidad:</strong>  ${agente.debilidad}</li>
                </ul>
            </div>
        `;
    } else {
        console.error("No se pudo emparejar el ID seleccionado con ningún agente:", idSeleccionado);
    }
});

const barraNivel = document.getElementById("rngNivel");
const etiquetaNumero = document.getElementById("lblNivel");

if(barraNivel && etiquetaNumero) {
    barraNivel.addEventListener("input", function() {
        etiquetaNumero.textContent = barraNivel.value;
    });
}