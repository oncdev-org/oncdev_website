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
    akaTag: "vobi / Aleksandr",
    tagline: "Being happy — making happiness",

    // Bio
    heroBio: "I build web services, make games in Unity, and work on oncdev projects.",
    btnProjects: "Projects ↓",
    btnContact: "Contacts",

    // Section Labels & Titles
    secAboutLabel: "ABOUT",
    secAboutTitle: "Making things that work.",
    aboutP1: "I build websites, web apps, game mechanics, and internal services at oncdev. I like figuring out how complex things work and turning them into straightforward projects.",
    aboutP2: "I take projects from initial idea and code through testing, release, and ongoing support.",

    secProjectsLabel: "PROJECTS",
    secProjectsTitle: "Main projects.",
    secLabsLabel: "OTHER",
    secLabsTitle: "Other work and guides.",

    // Project Cards
    p1Name: "OncDev VPN",
    p1Desc: "Fast, stable personal VPN without unnecessary setup.",
    p1Status: "Online",

    p2Name: "oncdev",
    p2Desc: "Main website for our team's services and projects.",
    p2Status: "Online",

    p3Name: "SpaceCargo",
    p3Desc: "A space game currently in closed development.",
    p3Status: "In Progress",

    p4Name: "LMes",
    p4Desc: "A lightweight custom web messenger without the bloat.",
    p4Status: "Online",

    p5Name: "pc guide",
    p5Desc: "A straightforward PC guide for beginners covering the essentials.",
    p5Status: "In Progress",

    // Section 04: Focus & Stack
    secSkillsLabel: "ROLES & STACK",
    secSkillsTitle: "What I do and what I use.",
    roleDevTitle: "Development",
    roleDevDesc: "Web apps, backend services, Unity game logic, and scripting.",
    rolePoTitle: "Product",
    rolePoDesc: "Planning project structure, priorities, and how things work for users.",
    roleQaTitle: "QA & Testing",
    roleQaDesc: "Testing builds and services before release, hunting down bugs and edge cases.",
    stackLabel: "Tools & Languages",

    // Contacts
    secContactLabel: "CONTACTS",
    secContactTitle: "Get in touch.",
    contactSub: "For project ideas, questions, or just to say hi:",
    copiedToast: "Copied to clipboard",

    // Footer
    backToTop: "Back to top ↑"
  },
  ru: {
    akaTag: "vobi / Александр",
    tagline: "Цена времени — жизнь",

    // Bio
    heroBio: "Пишу веб-сервисы, делаю игры на Unity и занимаюсь проектами в oncdev.",
    btnProjects: "Проекты ↓",
    btnContact: "Контакты",

    // Section Labels & Titles
    secAboutLabel: "ОБО МНЕ",
    secAboutTitle: "Делаю вещи, которые работают.",
    aboutP1: "Разрабатываю сайты, веб-приложения, игровые механики и внутренние сервисы в oncdev. Люблю разбираться, как устроены сложные штуки, и собирать их в простые и понятные проекты.",
    aboutP2: "Веду задачи от задумки и кода до тестов, запуска и дальнейшей поддержки.",

    secProjectsLabel: "ПРОЕКТЫ",
    secProjectsTitle: "Основные проекты.",
    secLabsLabel: "ЕЩЁ",
    secLabsTitle: "Другие разработки и гайды.",

    // Project Cards
    p1Name: "OncDev VPN",
    p1Desc: "Быстрый и стабильный личный VPN без лишних настроек.",
    p1Status: "Работает",

    p2Name: "oncdev",
    p2Desc: "Основной сайт нашего объединения со всеми сервисами и проектами.",
    p2Status: "Работает",

    p3Name: "SpaceCargo",
    p3Desc: "Космическая игра. Пока в закрытой разработке.",
    p3Status: "В работе",

    p4Name: "LMes",
    p4Desc: "Собственный лёгкий веб-мессенджер без лишнего перегруза.",
    p4Status: "Работает",

    p5Name: "pc guide",
    p5Desc: "Гайд по ПК для новичков — просто и по делу о том, как всё устроено.",
    p5Status: "В работе",

    // Section 04: Focus & Stack
    secSkillsLabel: "СТЕК И РОЛИ",
    secSkillsTitle: "Чем занимаюсь и на чём пишу.",
    roleDevTitle: "Разработка",
    roleDevDesc: "Веб-приложения, бэкенд, логика для игр на Unity и автоматизация.",
    rolePoTitle: "Продукт",
    rolePoDesc: "Продумываю структуру проектов, задачи и то, как всё должно работать для людей.",
    roleQaTitle: "Тестирование",
    roleQaDesc: "Проверяю сервисы и билды перед релизом, ищу баги и узкие места.",
    stackLabel: "Инструменты",

    // Contacts
    secContactLabel: "КОНТАКТЫ",
    secContactTitle: "Связь.",
    contactSub: "По делу, с идеей или просто поздороваться:",
    copiedToast: "Скопировано в буфер обмена",

    // Footer
    backToTop: "Наверх ↑"
  }
};

let currentLang = localStorage.getItem('meforr_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initCopyButtons();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
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
