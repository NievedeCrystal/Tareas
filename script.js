// Variables globales
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let x = 50, y = 125, velocidad = 2, tiempo = 0, tipoMovimiento = 1;
let intervalo;

// Datos para gráficas
let tiempos = [], posiciones = [], velocidades = [], aceleraciones = [];

// Cargar las imágenes
const cuboImg = new Image();
const fondoImg = new Image();

// Ruta de las imágenes (cambia las rutas a las de tu servidor o archivo local)
cuboImg.src = '/Caracol.png'; // Cambia esto a la ruta de tu imagen de cubo
fondoImg.src = '/Fondo.png'; // Cambia esto a la ruta de tu imagen de fondo

// Configuración de gráficas con Chart.js
const configGrafica = (ctx, label, color) => new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [{ label, data: [], borderColor: color, fill: false }] },
    options: { responsive: false, scales: { x: { title: { display: true, text: "Tiempo (s)" } }, y: { title: { display: true, text: label } } } }
});

const graficaPosicion = configGrafica(document.getElementById("graficaPosicion").getContext("2d"), "Posición (px)", "blue");
const graficaVelocidad = configGrafica(document.getElementById("graficaVelocidad").getContext("2d"), "Velocidad (px/s)", "red");
const graficaAceleracion = configGrafica(document.getElementById("graficaAceleracion").getContext("2d"), "Aceleración (px/s²)", "green");

// Función para actualizar gráficas
function actualizarGraficas() {
    graficaPosicion.data.labels = tiempos;
    graficaPosicion.data.datasets[0].data = posiciones;
    graficaPosicion.update();

    graficaVelocidad.data.labels = tiempos;
    graficaVelocidad.data.datasets[0].data = velocidades;
    graficaVelocidad.update();

    graficaAceleracion.data.labels = tiempos;
    graficaAceleracion.data.datasets[0].data = aceleraciones;
    graficaAceleracion.update();
}

// Función para mover el cubo
function moverCubo() {
    tiempo++;
    let aceleracion = 0, velocidadActual = velocidad;

    switch (tipoMovimiento) {
        case 1: // MRU (Velocidad constante)
            x += velocidad;
            aceleracion = 0;
            break;
        case 2: // MRUV (Aceleración constante)
            aceleracion = 0.5; // Aceleración fija
            velocidadActual = velocidad + aceleracion * tiempo;
            x += velocidadActual;
            break;
        case 3: // MRV (Aceleración variable)
            aceleracion = Math.sin(tiempo * 0.1); // Aceleración variable
            velocidadActual = velocidad + aceleracion * tiempo;
            x += velocidadActual;
            break;
    }

    // Guardar datos en arrays
    tiempos.push(tiempo);
    posiciones.push(x);
    velocidades.push(velocidadActual);
    aceleraciones.push(aceleracion);

    // Limpiar y dibujar el fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height); // Dibuja el fondo para cubrir el canvas

    // Dibujar la imagen del cubo
    ctx.drawImage(cuboImg, x, y, 50, 50); // Ajusta el tamaño según sea necesario

    actualizarGraficas();

    // Detener si el cubo sale de la pantalla
    if (x > canvas.width) {
        clearInterval(intervalo);
    }
}

// Función para seleccionar el movimiento
function seleccionarMovimiento(tipo) {
    tipoMovimiento = tipo;
    x = 50;
    tiempo = 0;
    tiempos = [];
    posiciones = [];
    velocidades = [];
    aceleraciones = [];

    clearInterval(intervalo);
    intervalo = setInterval(moverCubo, 50);
}

// Función para mostrar ecuaciones en una alerta
function mostrarEcuaciones() {
    let ecuaciones = "📜 Ecuaciones del movimiento:\n\n" +
        "🔹 MRU: x = x0 + v * t\n" +
        "🔹 MRUV: x = x0 + v0 * t + (1/2) * a * t²\n" +
        "🔹 MRV: Movimiento con aceleración variable (depende de la función de aceleración).";
    alert(ecuaciones);
}

// Iniciar con MRU por defecto
document.addEventListener("DOMContentLoaded", function() {
    fondoImg.onload = function() {
        cuboImg.onload = function() {
            seleccionarMovimiento(1);
        };
    };
});
