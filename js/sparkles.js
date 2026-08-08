/* Floating Gold Sparkles & Soft Heart Petals Background Animation */

class SparkleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 35;
    
    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.5 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      isHeart: Math.random() > 0.7,
      color: Math.random() > 0.5 ? '#D4AF37' : '#F8A5A5'
    };
  }

  drawHeart(x, y, size, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.fillStyle = `rgba(248, 165, 165, ${opacity * 0.6})`;
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }

      if (p.isHeart) {
        this.drawHeart(p.x, p.y, p.size * 3, Math.max(0.1, Math.min(0.8, p.opacity)));
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, Math.min(0.7, p.opacity))})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#D4AF37';
        this.ctx.fill();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SparkleCanvas('bg-canvas');
});
