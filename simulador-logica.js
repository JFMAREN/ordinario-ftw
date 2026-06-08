class ArquetipoDTO {
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

let listaArquetipos = [];

fetch('arquetipos.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let nodos = xmlDoc.getElementsByTagName("arquetipo");

        let selector = document.getElementById("selectorArquetipos");
        selector.innerHTML = '<option value="">-- Elige un Arquetipo --</option>';

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
            let arquetipoDto = new ArquetipoDTO(id, nombre, linaje, fuerza, magia, agilidad, debilidad, imagen, descripcion);
            listaArquetipos.push(arquetipoDto);

            let opcion = document.createElement("option");
            opcion.value = arquetipoDto.id;
            opcion.textContent = `${arquetipoDto.nombre} (${arquetipoDto.linaje})`;
            selector.appendChild(opcion);
        }
    })
    .catch(error => console.error("Error al procesar el archivo de datos:", error));

document.getElementById("selectorArquetipos").addEventListener("change", function(e) {
    let idSeleccionado = e.target.value;
    let arquetipo = listaArquetipos.find(arq => arq.id === idSeleccionado);
    
    let imgElement = document.getElementById("avatarArquetipo");
    let txtNombre = document.getElementById("txtNombreArquetipo");

    if (arquetipo) {
        document.getElementById("valFuerza").textContent = arquetipo.fuerza;
        document.getElementById("valMagia").textContent = arquetipo.magia;
        document.getElementById("valAgilidad").textContent = arquetipo.agilidad;
        document.getElementById("valDebilidad").textContent = arquetipo.debilidad;
        document.getElementById("valDescripcion").textContent = arquetipo.descripcion;
        
        txtNombre.textContent = arquetipo.nombre;
        imgElement.src = arquetipo.imagen;
        imgElement.style.display = "block";

        let rolCalculado = "";
        if (arquetipo.fuerza > arquetipo.magia) {
            rolCalculado = "Atacante Físico";
        } else if (arquetipo.magia > arquetipo.fuerza) {
            rolCalculado = "Usuario de Magia";
        } else {
            rolCalculado = "Soporte Híbrido";
        }
        document.getElementById("valRol").textContent = rolCalculado;

        let prioridadTurno = "";
        if (arquetipo.agilidad >= 15) {
            prioridadTurno = "ALTA (Inicia Combate)";
        } else if (arquetipo.agilidad >= 10) {
            prioridadTurno = "MEDIA (Turno Estándar)";
        } else {
            prioridadTurno = "BAJA (Último Turno)";
        }
        document.getElementById("valPrioridad").textContent = prioridadTurno;

    } else {
        document.querySelectorAll(".tabla-stats span").forEach(span => span.textContent = "-");
        txtNombre.textContent = "-";
        imgElement.src = "";
        imgElement.style.display = "none";
        document.getElementById("valDescripcion").textContent = "Selecciona un Arquetipo del Grimorio para calcular sus especificaciones tácticas de combate.";
    }
});