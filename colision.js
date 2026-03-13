const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// dimensiones pantalla
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(229, 245, 252)";

class Circle {

constructor(x, y, radius, color, text, speed) {

    this.posX = x;
    this.posY = y;
    this.radius = radius;

    this.color = color;
    this.originalColor = color;

    this.text = text;

    this.speed = speed;

    // velocidad inicial aleatoria
    this.dx = (Math.random() - 0.5) * speed * 2;
    this.dy = (Math.random() - 0.5) * speed * 2;

    // tiempo que dura el flash azul
    this.flashTime = 0;
}

draw(context) {

    context.beginPath();

    context.strokeStyle = this.color;

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";

    context.fillText(this.text, this.posX, this.posY);

    context.lineWidth = 2;

    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);

    context.stroke();

    context.closePath();
}

update(context) {

    // mover círculo
    this.posX += this.dx;
    this.posY += this.dy;

    // rebote horizontal
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
        this.dx *= -1;
    }

    // rebote vertical
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
        this.dy *= -1;
    }

    // control del flash azul
    if (this.flashTime > 0) {
        this.flashTime--;

        if (this.flashTime === 0) {
            this.color = this.originalColor;
        }
    }

    this.draw(context);
}

checkCollision(other) {

    let dx = other.posX - this.posX;
    let dy = other.posY - this.posY;

    let distance = Math.sqrt(dx * dx + dy * dy);        //AQUI SE USA LA FORMULA

    // verificar colisión
    if (distance < this.radius + other.radius) {

        let angle = Math.atan2(dy, dx);

        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        // rotar velocidades
        let vx1 = this.dx * cos + this.dy * sin;
        let vy1 = this.dy * cos - this.dx * sin;

        let vx2 = other.dx * cos + other.dy * sin;
        let vy2 = other.dy * cos - other.dx * sin;

        // intercambiar velocidades
        let temp = vx1;
        vx1 = vx2;
        vx2 = temp;

        // rotar de regreso
        this.dx = vx1 * cos - vy1 * sin;
        this.dy = vy1 * cos + vx1 * sin;

        other.dx = vx2 * cos - vy2 * sin;
        other.dy = vy2 * cos + vx2 * sin;

        // flash azul
        this.color = "#0000FF";
        other.color = "#0000FF";

        this.flashTime = 5;
        other.flashTime = 5;
    }
}

}

// array de círculos
let circles = [];

// generar círculos aleatorios
function generateCircles(n) {

for (let i = 0; i < n; i++) {

    let radius = Math.random() * 30 + 20;

    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;

    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;

    let speed = Math.random() * 3 + 1;

    let text = `C${i + 1}`;

    circles.push(new Circle(x, y, radius, color, text, speed));

}

}

// detectar colisiones colectivas
function detectCollisions() {

for (let i = 0; i < circles.length; i++) {

    for (let j = i + 1; j < circles.length; j++) {

        circles[i].checkCollision(circles[j]);

    }

}

}

// animación
function animate() {

ctx.clearRect(0, 0, window_width, window_height);

detectCollisions();

circles.forEach(circle => {
    circle.update(ctx);
});

requestAnimationFrame(animate);

}

// iniciar
generateCircles(20);        //AQUI SE CAMBIA EL NUMERO DE CIRCULOS
animate();