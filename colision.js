const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(159, 195, 211)";
let score = 0;          //Contador
const images = [
    "assets/img/jiniret.png",
    "assets/img/leebit.png",
    "assets/img/puppym.png"
];
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // guardar color original
        this.text = text;
        this.speed = speed;

        this.dx = 0; // sin movimiento horizontal
        this.dy = getSpeed(); // solo movimiento vertical

        this.flashTime = 0; // tiempo de color azul

        // Para agregar imagenes
        this.image = new Image();

        // elegir imagen aleatoria
        let randomImage = images[Math.floor(Math.random() * images.length)];

        this.image.src = randomImage;
        
    }
    draw(context) {
        context.drawImage(
        this.image,
        this.posX - this.radius,
        this.posY - this.radius,
        this.radius * 1.5,
        this.radius * 1.5
    );

    }
    update(context) {

    this.posX += this.dx;
    this.posY += this.dy;

    if (this.posY - this.radius > window_height) {

    this.posY = -this.radius;
    this.posX = Math.random() * window_width;

}

    // controlar flash azul
    if (this.flashTime > 0) {
        this.flashTime--;
        if (this.flashTime === 0) {
            this.color = this.originalColor;
        }
    }

    this.draw(context);

        
    }
}
// Crear un array para almacenar N círculos
let circles = [];
// Función para generar círculos aleatorios
function generateCircles(n) {

    circles = []; // reinicia el arreglo

    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = -radius;                        // empieza arriba del canvas
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        let speed = getSpeed();                 //
        let text = `C${i + 1}`;

        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function drawScore() {

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "right";

    ctx.fillText("Objetos: " + score, window_width - 20, 40);
}


// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });
    drawScore();            //Score
    requestAnimationFrame(animate); // Repetir la animación
}

//Funcion para las velocidades 
function getSpeed() {

    if (score > 15) {
        return Math.random() * 5 + 3; // velocidad alta
    }

    if (score > 10) {
        return Math.random() * 3 + 1.2; // velocidad media
    }

    return Math.random() * 1.2 + 0.1; // velocidad inicial
}

//Eliminar circulo con un click
canvas.addEventListener("click", function(event) {

    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    for (let i = circles.length - 1; i >= 0; i--) {

        let dx = mouseX - circles[i].posX;
        let dy = mouseY - circles[i].posY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= circles[i].radius) {

            circles.splice(i, 1);

            score++; // aumentar contador

            // crear nuevo objeto arriba
            let radius = Math.random() * 30 + 20;
            let x = Math.random() * window_width;
            let y = -radius;
            let color = "white";
            let speed = getSpeed();
            let text = "";

            circles.push(new Circle(x, y, radius, color, text, speed));
        }
    }
});

// Generar N círculos y comenzar la animación
generateCircles(20); // Puedes cambiar el número de círculos aquí
animate();