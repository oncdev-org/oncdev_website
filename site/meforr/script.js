/**
 * meforr Portfolio Script
 * Handles:
 * 1. EN / RU Language Switcher
 * 2. Copy-to-clipboard for Discord / Email with Toast
 * 3. Scroll Spine Animation
 */

// I18n Translations Dictionary
const translations = {
  en: {
    akaTag: "AKA vobi • Aleksandr",
    tagline: "Being happy — making happiness",

    // Bio
    heroBio: "Building independent web services, game prototypes, and maintaining core projects.",
    btnProjects: "Explore Projects ↓",
    btnContact: "Get in Touch",

    // Section Labels & Titles
    secAboutLabel: "01 / ABOUT",
    secAboutTitle: "Building things that work, because it's cool.",
    aboutP1: "I develop web applications, game systems, independent services, and tools under the oncdev ecosystem. I like getting deep into how complex systems work under the hood and assembling them into intuitive products.",
    aboutP2: "Focusing on full-cycle development — from concept design and architectural decisions to coding, testing, and long-term maintenance.",

    secProjectsLabel: "02 / FEATURED PROJECTS",
    secProjectsTitle: "Core products & active development.",
    secLabsLabel: "03 / OTHER LABS",
    secLabsTitle: "Experiments, apps & guides.",

    // Project Cards
    p1Name: "OncDev VPN",
    p1Desc: "Fast, minimal, hassle-free personal VPN service built for stability.",
    p1Status: "Online",

    p2Name: "oncdev",
    p2Desc: "Main platform & digital ecosystem for independent projects and development.",
    p2Status: "Online",

    p3Name: "SpaceCargo",
    p3Desc: "Details are classified. Something is cooking.",
    p3Status: "In Progress",

    p4Name: "LMes",
    p4Desc: "Custom messenger project built with privacy and simplicity in mind.",
    p4Status: "Online",

    p5Name: "pc guide",
    p5Desc: "A beginner-friendly guide for new PC users to easily master essential computer features and capabilities.",
    p5Status: "In Progress",

    // Section 04: Focus & Stack
    secSkillsLabel: "04 / FOCUS & STACK",
    secSkillsTitle: "What I do & what I build with.",
    roleDevTitle: "Developer",
    roleDevDesc: "Full-stack web services, game logic, system architecture, and scripting.",
    rolePoTitle: "Product Ownership",
    rolePoDesc: "Product vision, ecosystem planning, feature prioritization, and project lifecycle.",
    roleQaTitle: "QA",
    roleQaDesc: "Comprehensive testing, stability analysis, edge case verification, and quality assurance.",
    stackLabel: "Tech Stack",

    // Contacts
    secContactLabel: "05 / CONTACTS",
    secContactTitle: "Let's connect.",
    contactSub: "Have an idea, collaboration proposal, or just want to chat?",
    copiedToast: "Copied to clipboard!",

    // Footer
    backToTop: "Back to top ↑"
  },
  ru: {
    akaTag: "AKA vobi • Александр",
    tagline: "Цена времени — жизнь",

    // Bio
    heroBio: "Создаю веб-сервисы, разрабатываю игры и поддерживаю экосистему oncdev.",
    btnProjects: "Смотреть проекты ↓",
    btnContact: "Написать мне",

    // Section Labels & Titles
    secAboutLabel: "01 / ОБО МНЕ",
    secAboutTitle: "Создаю то, что работает, так как это круто.",
    aboutP1: "Разрабатываю веб-сервисы, игры, инструменты и решения в рамках проекта oncdev. Мне нравится разбираться, как устроены сложные системы изнутри, и превращать их в готовые продукты.",
    aboutP2: "Занимаюсь полным циклом: от идеи и проектирования архитектуры до написания кода, тестирования и поддержки.",

    secProjectsLabel: "02 / ГЛАВНЫЕ ПРОЕКТЫ",
    secProjectsTitle: "Основная разработка и релизы.",
    secLabsLabel: "03 / ДРУГИЕ ПРОЕКТЫ",
    secLabsTitle: "Эксперименты, мессенджеры и гайды.",

    // Project Cards
    p1Name: "OncDev VPN",
    p1Desc: "Быстрый, стабильный и простой VPN-сервис без лишних трудностей.",
    p1Status: "Online",

    p2Name: "oncdev",
    p2Desc: "Главный сайт и экосистема независимых IT-проектов и разработки.",
    p2Status: "Online",

    p3Name: "SpaceCargo",
    p3Desc: "Подробности засекречены. Что-то готовится.",
    p3Status: "В разработке",

    p4Name: "LMes",
    p4Desc: "Кастомный мессенджер, создаваемый с фокусом на удобство и лаконичность.",
    p4Status: "Online",

    p5Name: "pc guide",
    p5Desc: "Понятное руководство для тех, кто недавно начал осваивать ПК и хочет быстро разобраться в его функциях.",
    p5Status: "В разработке",

    // Section 04: Focus & Stack
    secSkillsLabel: "04 / НАПРАВЛЕНИЯ И СТЕК",
    secSkillsTitle: "Чем занимаюсь и на чём пишу.",
    roleDevTitle: "Разработка",
    roleDevDesc: "Веб-сервисы, архитектура, игровая логика и скрипты.",
    rolePoTitle: "Product Ownership",
    rolePoDesc: "Видение продукта, планирование экосистемы, приоритизация задач и жизненный цикл проектов.",
    roleQaTitle: "QA / Тестирование",
    roleQaDesc: "Комплексное тестирование, поиск багов, проверка пограничных сценариев и контроль стабильности.",
    stackLabel: "Стек технологий",

    // Contacts
    secContactLabel: "05 / КОНТАКТЫ",
    secContactTitle: "Связь.",
    contactSub: "Есть идея, предложение по сотрудничеству или просто хотите написать?",
    copiedToast: "Скопировано в буфер обмена!",

    // Footer
    backToTop: "Наверх ↑"
  }
};

let currentLang = localStorage.getItem('meforr_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'dark-ember');
  initLanguage();
  initCopyButtons();
  initSpineObserver();
});

/* Language Switcher */
function initLanguage() {
  setLanguage(currentLang);
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'ru' : 'en';
      setLanguage(nextLang);
    });
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('meforr_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  
  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }

  const dict = translations[lang] || translations.en;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

/* Copy to Clipboard Notification */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(translations[currentLang].copiedToast || "Copied!");
        });
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

/* Scroll Spine Node Observer */
function initSpineObserver() {
  const sections = document.querySelectorAll('.vertical-section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-section');
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}
