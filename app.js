const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.textBaseline = "middle";
let letterArray = ["R", "O", "C", "O", "M", "U", "N", "I", "C", "A"];
let hue = 0;
let particles = [];
let numberOfParticles = (canvas.width * canvas.height) / 7000;

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
// make it for movile devices
window.addEventListener("touchmove", (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
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
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 1.5, true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        ctx.font = `bold ${this.radius}px roboto`;
        ctx.fillText(
            this.text,
            this.x - this.radius / 2.7,
            this.y + this.radius / 10
        );
    }
    update() {
        if (mouse.x === undefined && mouse.y === undefined) {
            let newX =
                ((mouse.radius * canvas.width) / 200) *
                Math.sin(mouse.autopilotAngle * (Math.PI / 180));

            let newY =
                ((mouse.radius * canvas.height) / 200) *
                Math.cos(mouse.autopilotAngle * (Math.PI / 180));

            mouse.x = newX + canvas.width / 2;
            mouse.y = newY + canvas.height / 2;
        }
        mouse.autopilotAngle += 0.05;
    }
}

function handleOverlap() {
    let overlaping = false;
    let protection = 500;
    let counter = 0;

    while (particles.length < numberOfParticles && counter < protection) {
        let randomAngle = Math.random() * Math.PI * 2;
        let randomRadius = mouse.radius * Math.sqrt(Math.random());
        let particle = {
            x: mouse.x + randomRadius * Math.cos(randomAngle),
            y: mouse.y + randomRadius * Math.sin(randomAngle),
            radius: Math.floor(Math.random() * 30) + 10,
        };
        overlaping = false;
        for (let i = 0; i < particles.length; i++) {
            let previousParticle = particles[i];
            let dx = particle.x - previousParticle.x;
            let dy = particle.y - previousParticle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < previousParticle.radius + particle.radius) {
                overlaping = true;
                break;
            }
        }
        if (!overlaping) {
            particles.unshift(
                new Particle(particle.x, particle.y, particle.radius)
            );
        }
        counter++;
    }
}

// for (let i = 0; i < numberOfParticles; i++) {
//     particles.unshift(new Particle(mouse.x, mouse.y, 20));
// }

handleOverlap();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    if (particles.length >= numberOfParticles) {
        for (let i = 0; i < 5; i++) {
            particles.pop();
        }
    }
    handleOverlap();
    hue += 1;
    requestAnimationFrame(animate);
}

animate();
let autopilot = setInterval(() => {
    mouse.x = undefined;
    mouse.y = undefined;
}, 40);

canvas.addEventListener("mouseleave", () => {
    autopilot = setInterval(() => {
        mouse.x = undefined;
        mouse.y = undefined;
    }, 40);
});

canvas.addEventListener("mouseenter", () => {
    clearInterval(autopilot);
    autopilot = undefined;
});

// window.addEventListener("resize", () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// });
