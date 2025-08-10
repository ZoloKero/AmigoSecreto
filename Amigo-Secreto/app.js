let amigos = JSON.parse(localStorage.getItem('amigos')) || [];
let listasGuardadas = JSON.parse(localStorage.getItem('listasAmigos')) || {};
const inputAmigo = document.getElementById('amigo');
const listaAmigos = document.getElementById('listaAmigos');
const resultado = document.getElementById('resultado');
const reiniciarBtn = document.getElementById('reiniciarBtn');

document.addEventListener('DOMContentLoaded', () => {
    actualizarLista();
    inputAmigo.focus();
    reiniciarBtn.style.display = amigos.length > 0 ? 'block' : 'none';
});

function agregarAmigo() {
    const nombre = inputAmigo.value.trim();
    
    if (!nombre) {
        mostrarAlerta('Por favor ingresa un nombre válido');
        return;
    }
    
    if (amigos.includes(nombre)) {
        mostrarAlerta('Este nombre ya está en la lista');
        return;
    }
    
    amigos.push(nombre);
    guardarDatos();
    actualizarLista();
    inputAmigo.value = "";
    inputAmigo.focus();
}

function actualizarLista() {
    listaAmigos.innerHTML = "";
    amigos.forEach((nombre, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${nombre}</span>
            <button class="delete-btn" onclick="eliminarAmigo(${index})">×</button>
        `;
        listaAmigos.appendChild(li);
    });
    
    reiniciarBtn.style.display = amigos.length > 0 ? "block" : "none";
}

function eliminarAmigo(index) {
    amigos.splice(index, 1);
    guardarDatos();
    actualizarLista();
}

function sortearAmigo() {
    if (amigos.length < 2) {
        mostrarAlerta('Necesitas al menos 2 amigos para sortear');
        return;
    }
    
    const mezclados = [...amigos];
    for (let i = mezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }
    
    resultado.innerHTML = "";
    for (let i = 0; i < mezclados.length; i++) {
        const amigoSecreto = mezclados[(i + 1) % mezclados.length];
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${mezclados[i]}</span>
            <span>→</span>
            <strong>${amigoSecreto}</strong>
        `;
        resultado.appendChild(li);
    }
    
    reiniciarBtn.style.display = "block";
    mostrarAlerta('¡Sorteo realizado con éxito!');
}

function guardarLista() {
    const nombreLista = prompt("Nombre para esta lista:");
    if (nombreLista) {
        listasGuardadas[nombreLista] = [...amigos];
        localStorage.setItem('listasAmigos', JSON.stringify(listasGuardadas));
        mostrarAlerta(`Lista "${nombreLista}" guardada`);
    }
}

function mostrarListasGuardadas() {
    const modal = document.getElementById('modalListas');
    const contenido = document.getElementById('listasDisponibles');
    
    contenido.innerHTML = Object.keys(listasGuardadas).length === 0
        ? "<p>No hay listas guardadas</p>"
        : Object.keys(listasGuardadas).map(nombre => `
            <div class="saved-list-item">
                <span>${nombre} (${listasGuardadas[nombre].length} amigos)</span>
                <button onclick="cargarLista('${nombre}')">Cargar</button>
            </div>
        `).join('');
    
    modal.style.display = "flex";
}

function cargarLista(nombre) {
    amigos = [...listasGuardadas[nombre]];
    guardarDatos();
    actualizarLista();
    cerrarModal();
    resultado.innerHTML = "";
    mostrarAlerta(`Lista "${nombre}" cargada`);
}

function cerrarModal() {
    document.getElementById('modalListas').style.display = "none";
}

function reiniciarTodo() {
    if (confirm("¿Estás seguro de reiniciar todo? Se perderán los datos actuales")) {
        amigos = [];
        guardarDatos();
        actualizarLista();
        resultado.innerHTML = "";
        reiniciarBtn.style.display = "none";
    }
}

function exportarLista() {
    if (amigos.length === 0) {
        mostrarAlerta('No hay amigos para exportar');
        return;
    }
    
    const blob = new Blob([amigos.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "amigos-secretos.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarLista(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const nuevosAmigos = e.target.result.split("\n")
            .map(nombre => nombre.trim())
            .filter(nombre => nombre.length > 0);
        
        if (nuevosAmigos.length > 0 && confirm(`¿Importar ${nuevosAmigos.length} amigos?`)) {
            amigos = nuevosAmigos;
            guardarDatos();
            actualizarLista();
            resultado.innerHTML = "";
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function guardarDatos() {
    localStorage.setItem('amigos', JSON.stringify(amigos));
}

function mostrarAlerta(mensaje) {
    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.style.position = "fixed";
    alerta.style.bottom = "20px";
    alerta.style.left = "50%";
    alerta.style.transform = "translateX(-50%)";
    alerta.style.padding = "12px 24px";
    alerta.style.backgroundColor = "#388E3C";
    alerta.style.color = "white";
    alerta.style.borderRadius = "8px";
    alerta.style.zIndex = "1000";
    alerta.style.animation = "fadeIn 0.3s, fadeOut 0.3s 2.7s";
    
    document.body.appendChild(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

inputAmigo.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        agregarAmigo();
    }
});