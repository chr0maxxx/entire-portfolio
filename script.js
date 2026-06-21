// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const CONFIG = {
  matrix: {
    chars:
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF",
    fontSize: 14,
    speed: 50,
    opacity: 0.05,
  },
  glitchInterval: 5000,
  timeUpdateInterval: 1000,
};

// ============================================
// ДАННЫЕ ПРОЕКТОВ
// ============================================
const projects = [
  {
    name: "fintech-dashboard",
    desc: "Аналитическая панель для финансовой компании",
    tech: "React, TypeScript, Node.js, PostgreSQL",
    features:
      "• Real-time данные\n• Интерактивные графики\n• Экспорт отчётов\n• Ролевая система",
  },
  {
    name: "ecommerce-platform",
    desc: "Интернет-магазин с полным функционалом",
    tech: "Vue.js, Firebase, Stripe API",
    features:
      "• Каталог товаров\n• Корзина и оплата\n• Система отзывов\n• Админ-панель",
  },
  {
    name: "saas-landing",
    desc: "Продающий лендинг для SaaS-продукта",
    tech: "Next.js, Tailwind CSS, Prisma",
    features:
      "• A/B тестирование\n• CRM интеграция\n• Анимации при скролле\n• SEO оптимизация",
  },
  {
    name: "3d-portfolio",
    desc: "Интерактивное портфолио с 3D-эффектами",
    tech: "React, Three.js, WebGL",
    features:
      "• 3D визуализация\n• WebGL анимации\n• Иммерсивный опыт\n• Оптимизация",
  },
  {
    name: "crm-system",
    desc: "Система управления клиентами",
    tech: "React, Node.js, MongoDB, Socket.io",
    features:
      "• Управление контактами\n• Воронка продаж\n• Автоматизация\n• Аналитика",
  },
];

// ============================================
// MATRIX RAIN
// ============================================
const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const columns = Math.floor(canvas.width / CONFIG.matrix.fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = `rgba(15, 15, 15, ${CONFIG.matrix.opacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#5DD62C";
  ctx.font = CONFIG.matrix.fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text =
      CONFIG.matrix.chars[
        Math.floor(Math.random() * CONFIG.matrix.chars.length)
      ];
    ctx.fillText(
      text,
      i * CONFIG.matrix.fontSize,
      drops[i] * CONFIG.matrix.fontSize,
    );

    if (
      drops[i] * CONFIG.matrix.fontSize > canvas.height &&
      Math.random() > 0.975
    ) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, CONFIG.matrix.speed);

// ============================================
// ОБНОВЛЕНИЕ ВРЕМЕНИ
// ============================================
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("current-time").textContent = timeStr;
  document.getElementById("status-time").textContent = timeStr;
}
updateTime();
setInterval(updateTime, CONFIG.timeUpdateInterval);

// ============================================
// НАВИГАЦИЯ
// ============================================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.boxShadow = "0 0 30px rgba(93,214,44,0.3)";
    setTimeout(() => {
      el.style.boxShadow = "";
    }, 1500);
  }
}

// ============================================
// АНИМАЦИЯ SKILL BARS
// ============================================
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-fill");
        fills.forEach((fill) => {
          const width = fill.getAttribute("data-width");
          setTimeout(() => {
            fill.style.width = width + "%";
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

document.querySelectorAll(".skill-bar").forEach((bar) => {
  skillObserver.observe(bar);
});

// ============================================
// ПРОЕКТЫ
// ============================================
function showProject(index) {
  const p = projects[index];
  document.getElementById("project-details").innerHTML = `
<span class="highlight"># ${p.name}</span>

${p.desc}

<span class="highlight">Технологии:</span> ${p.tech}

<span class="highlight">Возможности:</span>
${p.features}

<span class="dim">Нажмите на другой проект для просмотра</span>
    `;
}

// ============================================
// ИНТЕРАКТИВНЫЙ ТЕРМИНАЛ
// ============================================
const terminalInput = document.getElementById("terminal-input");
const terminalHistory = document.getElementById("terminal-history");
const interactiveTerminal = document.getElementById("interactive-terminal");

const commands = {
  help: () => `Доступные команды:
  about     - информация обо мне
  skills    - список навыков
  projects  - список проектов
  contact   - контактная информация
  date      - текущая дата и время
  whoami    - кто я
  clear     - очистить терминал
  help      - показать эту справку`,

  about: () => `Я веб-разработчик с 5-летним опытом.
Специализируюсь на frontend и fullstack разработке.
Создаю современные, быстрые и красивые веб-приложения.`,

  skills: () => `JavaScript/TypeScript: ███████████████████░ 95%
React/Next.js:        ██████████████████░░ 90%
Node.js/Express:      █████████████████░░░ 85%
Python/Django:        ████████████████░░░░ 80%
PostgreSQL/MongoDB:   ███████████████░░░░░ 75%
Docker/DevOps:        ██████████████░░░░░░ 70%`,

  projects: () => `1. fintech-dashboard    - Аналитическая панель
2. ecommerce-platform   - Интернет-магазин
3. saas-landing         - Продающий лендинг
4. 3d-portfolio         - 3D портфолио
5. crm-system           - CRM система

Введите "project N" для деталей (N от 1 до 5)`,

  contact: () => `Email:     dev@portfolio.ru
Telegram:  @webdev_alex
GitHub:    github.com/alexdev
Location:  Moscow, Russia`,

  date: () => new Date().toLocaleString("ru-RU"),

  whoami: () => "root (веб-разработчик)",

  clear: () => {
    terminalHistory.innerHTML = "";
    return null;
  },
};

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = "";

    if (cmd) {
      // Показываем введённую команду
      const cmdLine = document.createElement("div");
      cmdLine.className = "terminal-history";
      cmdLine.innerHTML = `<span class="cmd">root@portfolio:~$ ${cmd}</span>`;
      terminalHistory.appendChild(cmdLine);

      let output = "";

      if (cmd.startsWith("project ")) {
        const num = parseInt(cmd.split(" ")[1]);
        if (num >= 1 && num <= projects.length) {
          const p = projects[num - 1];
          output = `${p.name}\n${p.desc}\nТехнологии: ${p.tech}\n\n${p.features}`;
        } else {
          output = `Ошибка: проект не найден. Используйте числа 1-${projects.length}`;
        }
      } else if (commands[cmd]) {
        output = commands[cmd]();
      } else {
        output = `bash: ${cmd}: command not found. Введите "help" для списка команд.`;
      }

      if (output !== null) {
        const outLine = document.createElement("div");
        outLine.className = "terminal-history";
        outLine.innerHTML = `<span class="out">${output.replace(/\n/g, "<br>")}</span>`;
        terminalHistory.appendChild(outLine);
      }

      interactiveTerminal.scrollTop = interactiveTerminal.scrollHeight;
    }
  }
});

interactiveTerminal.addEventListener("click", () => {
  terminalInput.focus();
});

setTimeout(() => {
  terminalInput.focus();
}, 1000);

// ============================================
// GLITCH ЭФФЕКТ
// ============================================
setInterval(() => {
  const elements = document.querySelectorAll(".tmux-pane-header");
  const randomEl = elements[Math.floor(Math.random() * elements.length)];
  randomEl.classList.add("glitch");
  setTimeout(() => {
    randomEl.classList.remove("glitch");
  }, 200);
}, CONFIG.glitchInterval);
