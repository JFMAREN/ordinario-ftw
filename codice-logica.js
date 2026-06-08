class ArquetipoCodiceDTO {
    constructor(nombre, linaje, imagen, orientacion) {
        this.nombre = String(nombre);
        this.linaje = String(linaje);
        this.imagen = String(imagen);
        this.orientacion = String(orientacion); // Guarda si es 'FISICO' o 'MAGICO'
    }
}

let cacheArquetiposCodice = [];
let filtroOrientacionActual = "TODOS";
let textoBusquedaActual = "";

fetch('arquetipos.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("arquetipo");

        cacheArquetiposCodice = [];

        for (let i = 0; i < nodos.length; i++) {
            let nombre = nodos[i].getElementsByTagName("nombre")[0].textContent;
            let linaje = nodos[i].getElementsByTagName("linaje")[0].textContent;
            let imagen = nodos[i].getElementsByTagName("imagen")[0].textContent;
            let fuerza = Number(nodos[i].getElementsByTagName("fuerza")[0].textContent);
            let magia = Number(nodos[i].getElementsByTagName("magia")[0].textContent);

            // Clasificación lógica basada en las especificaciones operacionales de los atributos
            let orientacion = "FISICO";
            if (magia > fuerza) {
                orientacion = "MAGICO";
            }

            let arquetipoDto = new ArquetipoCodiceDTO(nombre, linaje, imagen, orientacion);
            cacheArquetiposCodice.push(arquetipoDto);
        }
        
        aplicarFiltrosCombinados();
    })
    .catch(error => console.error("Error al cargar el Códice desde el XML:", error));

function aplicarFiltrosCombinados() {
    // Filtrado por Botones de Orientación
    let deBotones = cacheArquetiposCodice;
    if (filtroOrientacionActual !== "TODOS") {
        deBotones = cacheArquetiposCodice.filter(arq => arq.orientacion === filtroOrientacionActual);
    }

    // Filtrado por cadena de texto ingresada en el Input
    let resultadoFinal = deBotones;
    if (textoBusquedaActual !== "") {
        resultadoFinal = deBotones.filter(arq => 
            arq.nombre.toLowerCase().includes(textoBusquedaActual)
        );
    }

    const consolaMsg = document.getElementById("consolaValidacion");
    if (consolaMsg) {
        if (textoBusquedaActual === "") {
            consolaMsg.textContent = "[Esperando entrada...]";
            consolaMsg.style.color = "#888";
        } else {
            let coincidenciaExacta = cacheArquetiposCodice.some(arq => arq.nombre.toLowerCase() === textoBusquedaActual);
            
            if (coincidenciaExacta) {
                consolaMsg.textContent = "Clase Validada en los Registros del Grimorio Real";
                consolaMsg.style.color = "#00ffcc";
            } else if (resultadoFinal.length > 0) {
                consolaMsg.textContent = `Buscando... (${resultadoFinal.length} coincidencias)`;
                consolaMsg.style.color = "gold";
            } else {
                consolaMsg.textContent = "Registro Inválido: La clase no existe en el archivo XML.";
                consolaMsg.style.color = "#ff4545";
            }
        }
    }
    renderizarCartasCodice(resultadoFinal);
}

function filtrarPorOrientacion(orientacionSeleccionada) {
    filtroOrientacionActual = orientacionSeleccionada;
    aplicarFiltrosCombinados();
}

const inputBuscar = document.getElementById("txtBusquedaArquetipo");
if (inputBuscar) {
    inputBuscar.addEventListener("input", function() {
        textoBusquedaActual = inputBuscar.value.toLowerCase().trim();
        aplicarFiltrosCombinados();
    });
}

function renderizarCartasCodice(datos) {
    let contenedor = document.getElementById("listaCompleta");
    if (!contenedor) return;
    
    contenedor.innerHTML = "";

    if (datos.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:20px; color:#ff4545; font-weight:bold;">❌ Ningún arquetipo coincide con los criterios de filtrado actuales.</p>`;
        return;
    }

    datos.forEach(arq => {
        contenedor.innerHTML += `
            <div class="tarjeta-compendio">
                <div class="marco-mini">
                    <img src="${arq.imagen}" alt="Ilustración oficial en el compendio para el arquetipo de clase ${arq.nombre}">
                </div>
                <h3>${arq.nombre}</h3>
                <p>Linaje: ${arq.linaje}</p>
            </div>
        `;
    });
}