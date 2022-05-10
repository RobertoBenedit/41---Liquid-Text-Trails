const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.textBaseline = "middle";
let letterArray = ["R", "O", "C", "O", "M", "U", "N", "I", "C", "A"];
let hue = 0;
let particles = [];
// let numberOfParticles = (canvas.width * canvas.height) / 5000;
let numberOfParticles = 20;

const mouse = {
    x: 0,
    y: 0,
    radius: 60,
    autopilotAngle: 0,
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = `hsl(${hue}, 100%, 50%)`;
        this.text = letterArray[Math.floor(Math.random() * letterArray.length)];
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.closePath();
        ctx.fill();
    }
}

function handleOverlap() {
    let overlaping = false;
    let protection = 500;
    let counter = 0;

    for (let i = 0; i < numberOfParticles; i++) {
        particles.unshift(new Particle(mouse.x, mouse.y, 20));
    }
}

handleOverlap();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
    if (particles.length >= numberOfParticles) {
        for (let i = 0; i < 18; i++) {
            particles.pop();
        }
    }
    handleOverlap();
    hue += 1;
    requestAnimationFrame(animate);
}

animate();
