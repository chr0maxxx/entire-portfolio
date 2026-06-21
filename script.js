const CONFIG = {
  // Частицы
  maxParticles: 250,
  initialParticles: 150,
  particleSize: { min: 1, max: 3 },
  particleSpeed: 1.4,
  particleDecay: { min: 0.003, max: 0.012 },

  // Цвета (HSL)
  hueRange: 360,
  saturation: 80,
  lightness: 70,

  // Связи между частицами
  connectionDistance: 200,
  connectionAlpha: 0.5,
  connectionLineWidth: 1,

  // Генерация частиц
  spawnRateAuto: 0.5,
  spawnRateMouse: 0.3,
  particlesPerClick: 5,
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.life = 1.0;
    this.decay =
      Math.random() * (CONFIG.particleDecay.max - CONFIG.particleDecay.min) +
      CONFIG.particleDecay.min;
    this.size =
      Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min) +
      CONFIG.particleSize.min;
    this.hue = Math.random() * CONFIG.hueRange;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, ${CONFIG.saturation}%, ${CONFIG.lightness}%, ${this.life})`;
    ctx.fill();
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONFIG.connectionDistance) {
        const alpha =
          (1 - distance / CONFIG.connectionDistance) *
          p1.life *
          p2.life *
          CONFIG.connectionAlpha;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `hsla(${(p1.hue + p2.hue) / 2}, ${CONFIG.saturation}%, ${CONFIG.lightness}%, ${alpha})`;
        ctx.lineWidth = CONFIG.connectionLineWidth;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (
    Math.random() < CONFIG.spawnRateAuto &&
    particles.length < CONFIG.maxParticles
  ) {
    particles.push(new Particle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  drawConnections();
  requestAnimationFrame(animate);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init() {
  resize();
  for (let i = 0; i < CONFIG.initialParticles; i++) {
    particles.push(new Particle());
  }
}

// Клики работают даже через контент
window.addEventListener("click", (e) => {
  for (let i = 0; i < CONFIG.particlesPerClick; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

// Движение мыши тоже ловится везде
window.addEventListener("mousemove", (e) => {
  if (Math.random() < CONFIG.spawnRateMouse) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

window.addEventListener("resize", resize);

init();
animate();

// ============================================
// ЛОГИКА КАРТОЧКИ ПРОЕКТА
// ============================================

const projectData = [
    { feature: "Адаптивный дизайн", image: "assets/images/screen1.png" },
    { feature: "Динамичный таймлайн", image: "assets/images/screen2.png" },
    { feature: "Красивые градиенты", image: "assets/images/screen3.png" },
    { feature: "Современные стили", image: "assets/images/screen4.png" }
];

let currentIndex = 0;
let isPaused = false;
let animationEndHandler = null;
const AUTO_PLAY_DELAY = 4000;

document.addEventListener('DOMContentLoaded', () => {
    const featuresList = document.getElementById('features-list');
    const sliderTrack = document.getElementById('slider-track');
    const sliderDots = document.getElementById('slider-dots');
    const projectSlider = document.getElementById('project-slider');

    if (!featuresList || !sliderTrack || !sliderDots || !projectSlider) {
        console.error('Элементы не найдены');
        return;
    }

    // Устанавливаем длительность анимации через CSS-переменную
    document.documentElement.style.setProperty('--progress-duration', `${AUTO_PLAY_DELAY}ms`);

    // Инициализация
    projectData.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'feature-item';
        li.textContent = item.feature;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        li.appendChild(progressBar);
        
        li.addEventListener('click', () => goToSlide(index));
        li.addEventListener('mouseenter', checkShouldPause);
        li.addEventListener('mouseleave', checkShouldPause);
        featuresList.appendChild(li);

        const img = document.createElement('img');
        img.className = 'slide';
        img.src = item.image;
        img.alt = item.feature;
        sliderTrack.appendChild(img);

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToSlide(index));
        dot.addEventListener('mouseenter', checkShouldPause);
        dot.addEventListener('mouseleave', checkShouldPause);
        sliderDots.appendChild(dot);
    });

    projectSlider.addEventListener('mouseenter', checkShouldPause);
    projectSlider.addEventListener('mouseleave', checkShouldPause);

    // Запуск прогрессбара на активном пункте
    function startProgressBar() {
        const activeFeature = featuresList.querySelector('.feature-item.active');
        if (!activeFeature) return;
        
        const progressBar = activeFeature.querySelector('.progress-bar');
        
        // Удаляем старый обработчик
        if (animationEndHandler) {
            progressBar.removeEventListener('animationend', animationEndHandler);
        }
        
        // Сброс и перезапуск анимации
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // принудительный reflow
        progressBar.style.animation = '';
        
        // Новый обработчик: когда анимация закончилась — переключаем
        animationEndHandler = () => {
            nextSlide();
        };
        progressBar.addEventListener('animationend', animationEndHandler);
    }

    // Проверка условий паузы
    function checkShouldPause() {
        const activeFeature = featuresList.querySelector('.feature-item.active');
        const activeDot = sliderDots.querySelector('.dot.active');
        
        const shouldPause = 
            (activeFeature && activeFeature.matches(':hover')) ||
            (activeDot && activeDot.matches(':hover')) ||
            projectSlider.matches(':hover');
        
        if (shouldPause && !isPaused) {
            isPaused = true;
            if (activeFeature) {
                activeFeature.classList.add('paused');
                const progressBar = activeFeature.querySelector('.progress-bar');
                progressBar.style.animationPlayState = 'paused';
            }
        } else if (!shouldPause && isPaused) {
            isPaused = false;
            if (activeFeature) {
                activeFeature.classList.remove('paused');
                const progressBar = activeFeature.querySelector('.progress-bar');
                progressBar.style.animationPlayState = 'running';
            }
        }
    }

    // Обновление карточки
    function updateCard() {
        const features = featuresList.querySelectorAll('.feature-item');
        features.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
            item.classList.remove('paused');
        });

        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        const slides = sliderTrack.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Запускаем прогрессбар для нового активного пункта
        startProgressBar();
        
        // Сбрасываем флаг паузы
        isPaused = false;
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCard();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % projectData.length;
        updateCard();
    }

    // Первый рендер
    updateCard();
});