// --- VARIABLES ---
const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const universe = document.getElementById("universe");
const finalStar = document.getElementById("finalStar");
const music = document.getElementById("music");

const envoltura = document.querySelector(".envoltura-sobre");
const carta = document.querySelector(".carta");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

let mensajeActual = ""; // Guardará el mensaje de la estrella seleccionada
let isAnimating = false; // Controla si hay una animación en progreso
let typeWriterInterval = null; // Guarda el intervalo activo del typewriter

// --- FUNCIÓN MÁQUINA DE ESCRIBIR ---
function typeWriter(text, element) {
    // Limpiar cualquier intervalo anterior
    if (typeWriterInterval) {
        clearInterval(typeWriterInterval);
    }

    element.textContent = "";
    let i = 0;
    typeWriterInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeWriterInterval);
            typeWriterInterval = null;
        }
    }, 50);
}

// --- ESTRELLAS FUGACES ---
function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");
    star.style.top = Math.random() * window.innerHeight * 0.5 + "px";
    star.style.left = Math.random() * window.innerWidth + "px";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
}

setInterval(() => {
    if (universe.style.display === "block") createShootingStar();
}, 2500);

// --- INICIAR UNIVERSO ---
startBtn.addEventListener("click", () => {
    intro.style.display = "none";
    universe.style.display = "block";

    music.volume = 0;
    music.play();
    let vol = 0;
    const fade = setInterval(() => {
        if (vol < 0.5) {
            vol += 0.01;
            music.volume = vol;
        } else clearInterval(fade);
    }, 100);

    document.querySelectorAll(".star").forEach((star, i) => {
        setTimeout(() => star.classList.add("show"), i * 300);
    });

    setTimeout(() => finalStar.classList.add("show"), 1500);
});

// --- CLICK EN ESTRELLAS PARA ABRIR SOBRE CERRADO ---
document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", () => {
        // Si ya hay una animación en progreso, ignorar el clic
        if (isAnimating) return;

        // Guardar mensaje de esa estrella
        mensajeActual = star.dataset.text;

        // Mostrar popup con sobre cerrado
        popup.style.display = "flex";
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("show"), 50);

        // Sobre cerrado
        envoltura.classList.remove("abierto");
        carta.classList.remove("abierta");
        carta.classList.remove("mostrar-carta");
        envoltura.classList.remove("desactivar-sobre");

        // Limpiar texto antes de abrir
        popupText.textContent = "";

        // Limpiar cualquier intervalo de escritura anterior
        if (typeWriterInterval) {
            clearInterval(typeWriterInterval);
            typeWriterInterval = null;
        }
    });
});

// --- CLICK SOBRE EL SOBRE PARA ABRIR Y ESCRIBIR MENSAJE DE ESA ESTRELLA ---
envoltura.addEventListener("click", () => {
    // Si la carta ya está abierta o hay una animación en progreso, ignorar
    if (carta.classList.contains("abierta") || isAnimating) return;

    isAnimating = true;

    // Primero abrimos el sobre
    envoltura.classList.add("abierto");

    // Después de que el sobre se abra, mostramos la carta
    setTimeout(() => {
        carta.classList.add("mostrar-carta");

        setTimeout(() => {
            carta.classList.remove("mostrar-carta");
            carta.classList.add("abierta");

            // Escribir mensaje de la estrella seleccionada
            typeWriter(mensajeActual, popupText);

            // Permitir nuevas interacciones después de que termine la animación
            isAnimating = false;
        }, 500);
    }, 700); // Esperamos a que la solapa del sobre termine de abrirse

    envoltura.classList.add("desactivar-sobre");
});

// --- CLICK EN CORAZÓN FINAL (puedes dejar un mensaje fijo si quieres) ---
finalStar.addEventListener("click", () => {
    // Si ya hay una animación en progreso, ignorar el clic
    if (isAnimating) return;

    mensajeActual = "No sé qué traerá el futuro, pero sí sé con quién quiero vivirlo ❤️";
    popup.style.display = "flex";
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("show"), 50);

    // Sobre cerrado
    envoltura.classList.remove("abierto");
    carta.classList.remove("abierta");
    carta.classList.remove("mostrar-carta");
    envoltura.classList.remove("desactivar-sobre");

    popupText.textContent = "";

    // Limpiar cualquier intervalo de escritura anterior
    if (typeWriterInterval) {
        clearInterval(typeWriterInterval);
        typeWriterInterval = null;
    }
});

// --- CERRAR POPUP AL HACER CLICK FUERA ---
document.addEventListener("click", (e) => {
    if (!e.target.matches(".sobre, .solapa-derecha, .solapa-izquierda, .corazon, .star, #finalStar, .carta, .contenido")) {
        if (carta.classList.contains("abierta") || popup.style.display === "flex") {
            // Si hay una animación en progreso, ignorar
            if (isAnimating) return;

            isAnimating = true;

            // Primero bajamos la carta
            carta.classList.add("cerrando-carta");
            envoltura.classList.remove("desactivar-sobre");

            setTimeout(() => {
                // Después de que la carta baja, quitamos la clase
                carta.classList.remove("cerrando-carta");
                carta.classList.remove("abierta");

                // Cerramos el sobre (la solapa vuelve a su posición)
                envoltura.classList.remove("abierto");

                // Esperamos a que termine la animación del sobre antes de ocultar el popup
                setTimeout(() => {
                    popup.classList.remove("show");
                    popup.style.display = "none";
                    isAnimating = false;
                }, 700); // Tiempo para que se complete la animación de cierre del sobre
            }, 500);
        }
    }
});