(function () {
    const canvas = document.getElementById('hero-interactive-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let shockwaves = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    // Control state
    let currentMode = 'mesh'; // 'mesh' or 'quantum'

    function resize() {
        const parent = canvas.parentElement;
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseVx = (Math.random() - 0.5) * 0.6;
            this.baseVy = (Math.random() - 0.5) * 0.6;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.size = Math.random() * 1.8 + 1;
            this.baseAlpha = Math.random() * 0.4 + 0.2;
            this.alpha = this.baseAlpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse repulsion & connection logic
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                    this.alpha = Math.min(1, this.baseAlpha + force * 0.6);
                } else {
                    this.alpha = this.baseAlpha;
                }
            }

            // Shockwave interaction
            shockwaves.forEach(wave => {
                const dx = this.x - wave.x;
                const dy = this.y - wave.y;
                const dist = Math.hypot(dx, dy);
                const waveDist = Math.abs(dist - wave.radius);

                if (waveDist < 30 && wave.alpha > 0.1) {
                    const force = (30 - waveDist) / 30 * wave.alpha;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 6;
                    this.y += Math.sin(angle) * force * 6;
                }
            });
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Shockwave {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 5;
            this.maxRadius = 180;
            this.alpha = 0.8;
            this.speed = 4;
        }

        update() {
            this.radius += this.speed;
            this.alpha *= 0.94;
        }

        draw() {
            if (this.alpha <= 0.01) return;
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((width * height) / 9000), 75);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        if (currentMode !== 'mesh') return;
        const maxDist = 125;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.18;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.75;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            shockwaves[i].update();
            shockwaves[i].draw();
            if (shockwaves[i].alpha <= 0.01 || shockwaves[i].radius >= shockwaves[i].maxRadius) {
                shockwaves.splice(i, 1);
            }
        }

        // Draw connections
        drawLines();

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw mouse telemetry laser indicator
        if (mouse.x !== null && mouse.y !== null) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resize);

    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', (e) => {
        const rect = parent.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    parent.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    parent.addEventListener('click', (e) => {
        const rect = parent.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        shockwaves.push(new Shockwave(clickX, clickY));
    });

    // Clean Toggle Mode Function: 'Сеть' vs 'Кванты'
    window.toggleCanvasMode = function (btn) {
        currentMode = currentMode === 'mesh' ? 'quantum' : 'mesh';
        btn.innerHTML = currentMode === 'mesh'
            ? '<i class="fa-solid fa-circle-nodes"></i> Сеть'
            : '<i class="fa-solid fa-atom"></i> Кванты';
    };

    resize();
    animate();
})();
