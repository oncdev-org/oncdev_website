import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Shield, 
  BookOpen, 
  BarChart2, 
  Users,
  Sparkles,
  Zap,
  Activity,
  Code2
} from "lucide-react";

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 99, y: 45 });
  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: Math.floor((e.clientX / window.innerWidth) * 100),
        y: Math.floor((e.clientY / window.innerHeight) * 100),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = (path) => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const cleanPath = path.replace(/^\/new_site/, '');
      window.location.href = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="bg-[#070709] text-slate-100 font-sans min-h-screen relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Subtle Restrained Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      {/* Blueprint Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#121215_1px,transparent_1px),linear-gradient(to_bottom,#121215_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-60"></div>

      {/* Top Technical HUD Bar with Restrained Cyan/Emerald Accents */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/main/index.html'); }} className="flex items-center gap-3 font-extrabold text-lg tracking-tight text-white hover:text-cyan-400 transition-colors">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-xs font-mono font-bold text-slate-950 shadow-md shadow-cyan-500/20">OC</span>
            <span>ONCDEV<span className="text-cyan-400">.</span></span>
          </a>

          {/* Navigation Items (Restrained Accents) */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] text-slate-400">
            <a 
              href="#" 
              className={`relative py-1 transition-colors hover:text-white ${activeTab === 'HOME' ? 'text-cyan-400 font-bold' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              HOME
              {activeTab === 'HOME' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/timer/index.html'); }} className="py-1 hover:text-white transition-colors">PROJECTS</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/vpn/index.html'); }} className="py-1 hover:text-cyan-400 transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>VPN LAB</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/wiki/index.html'); }} className="py-1 hover:text-white transition-colors">DOCS</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/about/index.html'); }} className="py-1 hover:text-white transition-colors">ABOUT</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/polisours/index.html'); }} className="py-1 text-slate-400 hover:text-amber-300 transition-colors">POLISOURS ↗</a>
          </nav>

          {/* Command Search Trigger & Coordinates */}
          <div className="flex items-center gap-6 text-slate-500">
            <span className="hidden sm:inline font-mono text-[10px]">X {coords.x} · Y {coords.y}</span>
            <button 
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-full text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer"
            >
              <span>CMD</span>
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-400 font-mono">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Hero & Project Section */}
      <div className="max-w-[1400px] mx-auto border-x border-slate-800/80">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-slate-800/80">
          
          {/* LEFT COLUMN: Giant Bold Typography & Action Box (Restrained Color Accents) */}
          <div className="lg:col-span-6 p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between space-y-12">
            
            <div className="space-y-8">
              {/* Monospace Eyebrow Badge with Mint Green Glow */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                <span>INDEPENDENT DEV TEAM / TEL AVIV & ONLINE</span>
              </div>

              {/* Giant Stacked Typography */}
              <h1 className="text-5xl sm:text-7xl xl:text-[5.2rem] font-extrabold text-white tracking-tighter leading-[0.92] uppercase font-sans">
                WE BUILD<br />
                TOOLS THAT<br />
                SERVE THE<br />
                COMMUNITY<span className="text-cyan-400">.</span>
              </h1>

              <p className="text-sm text-slate-400 max-w-md font-mono leading-relaxed uppercase tracking-wide">
                ATMOSPHERIC INDIE TOOLS, TELEMETRY TIMERS AND SECURE INFRASTRUCTURE SYSTEMS.
              </p>
            </div>

            {/* Action Box with KLTZQU Reference Hover Button */}
            <div className="pt-8 border-t border-slate-800/80 space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Reference Button Hover Effect: Slate BG -> Pure White Fill + Black Text */}
                <button 
                  onClick={() => {
                    const el = document.getElementById("projects-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group border border-cyan-500/40 bg-slate-900/80 px-6 py-4 text-xs font-mono tracking-widest text-cyan-300 uppercase transition-all duration-300 hover:bg-white hover:text-slate-950 hover:border-white flex items-center justify-between gap-6 cursor-pointer rounded-full"
                >
                  <span className="font-bold">VIEW PROJECTS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <div className="border border-slate-800 bg-slate-900/60 p-3.5 rounded-2xl text-[10px] font-mono text-slate-400 space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>CURRENT STATUS</span>
                  </div>
                  <p className="text-slate-400">BUILDING REAL-TIME TELEMETRY & VLESS VPN PROTOCOL</p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Technical Signal Grid & Interactive Project Rows */}
          <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-between space-y-10 bg-slate-950/40">
            
            <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
              <span className="text-cyan-400 font-semibold">| PROJECT SIGNAL / 2026</span>
              <span>SYSTEM MATRIX</span>
            </div>

            {/* Interactive Project Rows */}
            <div className="space-y-4 my-auto divide-y divide-slate-800/50">
              
              {/* Project Row 1: Timer */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('/timer/index.html'); }}
                className="group block pt-4 pb-6 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/01</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">
                      TIMER TELEMETRY
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest">
                    LIVE API
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  Real-time monitoring since last PolimerS publication.
                </p>
              </a>

              {/* Project Row 2: VPN */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('/vpn/index.html'); }}
                className="group block pt-4 pb-6 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/02</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">
                      VLESS VPN SYSTEM
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 tracking-widest">
                    ⚡ 12MS PING
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  High-speed encrypted protocol node with instant key generation.
                </p>
              </a>

              {/* Project Row 3: Wiki */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('/wiki/index.html'); }}
                className="group block pt-4 pb-6 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/03</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">
                      KNOWLEDGE WIKI
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded tracking-widest">
                    DOCS v2.0
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  Setup guides for iOS, Android, Windows, macOS and legal agreements.
                </p>
              </a>

              {/* Project Row 4: Summary */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('/channel-summary/index.html'); }}
                className="group block pt-4 pb-6 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/04</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">
                      YOUTUBE METRICS
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-widest">
                    ANALYTICS
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  Channel subscriber metrics and recent publication stream.
                </p>
              </a>

              {/* Project Row 5: Creators */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('/about/index.html'); }}
                className="group block pt-4 pb-6 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/05</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">
                      CREATORS & POLIMER
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded tracking-widest">
                    TEAM
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  Founders Vobi & Polimer profile showcase and PoliSours resources.
                </p>
              </a>

            </div>

            {/* Bottom Tech Badges with Restrained Colors */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
              <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">NODE.JS</span>
              <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">PYTHON & DATA</span>
              <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">C++ MATH</span>
              <span className="border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">VLESS PROTOCOL</span>
              <a href="https://github.com/oncdev-org" target="_blank" rel="noopener noreferrer" className="border border-slate-700 px-3 py-1 rounded-full text-white hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                GITHUB ONCDEV-ORG ↗
              </a>
            </div>

          </div>

        </section>

        {/* SECTION 01: Extended Projects Showcase */}
        <section id="projects-section" className="p-8 lg:p-14 border-b border-slate-800/80 space-y-12">
          
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
            <span className="text-cyan-400 font-semibold">| SECTION 01 / ECOSYSTEM DIRECTORY</span>
            <span>EXPLORE PRODUCTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Timer */}
            <div className="border border-slate-800 bg-slate-950/60 p-8 space-y-6 flex flex-col justify-between hover:border-cyan-500/50 transition-colors rounded-2xl group">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                  <span>01 // TELEMETRY</span>
                  <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> LIVE</span>
                </div>
                <h3 className="text-2xl font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">Таймер ожидания</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Мониторинг точного интервала времени с момента выхода последнего видео PolimerS и целевые даты.</p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl font-mono text-xs text-white flex justify-around">
                  <span>215д</span>
                  <span className="text-slate-600">•</span>
                  <span>14ч</span>
                  <span className="text-slate-600">•</span>
                  <span>32м</span>
                </div>
                <button 
                  onClick={() => navigateTo('/timer/index.html')}
                  className="w-full py-3 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono font-bold tracking-widest text-white uppercase hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ОТКРЫТЬ ТАЙМЕР</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: VPN */}
            <div className="border border-cyan-500/30 bg-slate-950/80 p-8 space-y-6 flex flex-col justify-between hover:border-cyan-400 transition-colors rounded-2xl group shadow-lg shadow-cyan-500/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">02 // NETWORK</span>
                  <span className="text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded text-[10px]">VLESS</span>
                </div>
                <h3 className="text-2xl font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">VPN-сервис</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Высокоскоростной и защищенный доступ в интернет на протоколах VLESS с пошаговой выдачей ключа.</p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <span>⚡ PING: 12ms</span>
                  <span className="text-slate-400">UPTIME 99.9%</span>
                </div>
                <button 
                  onClick={() => navigateTo('/vpn/index.html')}
                  className="w-full py-3 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold tracking-widest text-xs uppercase hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>ОФОРМИТЬ VPN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Wiki */}
            <div className="border border-slate-800 bg-slate-950/60 p-8 space-y-6 flex flex-col justify-between hover:border-cyan-500/50 transition-colors rounded-2xl group">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                  <span>03 // KNOWLEDGE</span>
                  <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[10px]">v2.0 DOCS</span>
                </div>
                <h3 className="text-2xl font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">База знаний</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Инструкции по настройке VPN для устройств, пользовательские соглашения и оферта.</p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Guides Hub</span>
                </div>
                <button 
                  onClick={() => navigateTo('/wiki/index.html')}
                  className="w-full py-3 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono font-bold tracking-widest text-white uppercase hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ЧИТАТЬ ИНСТРУКЦИИ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 02: Team Founders */}
        <section className="p-8 lg:p-14 border-b border-slate-800/80 space-y-12 bg-slate-950/40">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
            <span className="text-cyan-400 font-semibold">| SECTION 02 / FOUNDERS & CREATORS</span>
            <span>WHO WE ARE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder 1: Vobi */}
            <div className="border border-slate-800 bg-slate-950/80 p-8 space-y-6 hover:border-cyan-500/40 transition-colors rounded-2xl">
              <div className="flex items-center gap-6">
                <img src="/about/vobi-photo.jpg" alt="Vobi" className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500/30" />
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">FOUNDER</span>
                  <h3 className="text-2xl font-bold text-white">Vobi</h3>
                  <p className="text-xs text-slate-400">AKA sup, sunny / meforr</p>
                </div>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Основатель oncdev. Веб-разработка, прикладной софт, интерфейсы и проектирование пользовательского опыта.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">WEB DEV</span>
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">APPLIED SOFTWARE</span>
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">UI CRAFT</span>
              </div>
              <a href="https://vobi.bio.link" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline pt-2">
                <span>ПРОФИЛЬ VOBI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Founder 2: Polimer */}
            <div className="border border-slate-800 bg-slate-950/80 p-8 space-y-6 hover:border-cyan-500/40 transition-colors rounded-2xl">
              <div className="flex items-center gap-6">
                <img src="/about/polimer-photo.jpg" alt="Polimer" className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500/30" />
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">FOUNDER</span>
                  <h3 className="text-2xl font-bold text-white">Polimer</h3>
                  <p className="text-xs text-slate-400">AKA PolimerS / PoliSours</p>
                </div>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Основатель oncdev и автор канала PolimerS. Backend-разработчик, специалист по ИИ, прикладной математике и данным.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">BACKEND</span>
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">AI & MATH</span>
                <span className="border border-slate-800 px-2.5 py-1 rounded bg-slate-900">YOUTUBE CREATOR</span>
              </div>
              <a href="https://t.me/polisour/68" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline pt-2">
                <span>ПРОФИЛЬ POLIMER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 03: Changelog Timeline */}
        <section className="p-8 lg:p-14 space-y-8">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
            <span class="text-cyan-400 font-semibold">| SECTION 03 / SYSTEM CHANGELOG</span>
            <span>UPDATES</span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            <div className="py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <span className="text-slate-500">02-07-2026</span>
              <div className="sm:col-span-3 space-y-1">
                <h4 className="text-white font-bold uppercase">Релиз обновленной Базы Знаний v2.0</h4>
                <p className="text-slate-400">Опубликованы пошаговые руководства по настройке VLESS VPN для iOS, Android, Windows и macOS.</p>
              </div>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <span className="text-slate-500">07-06-2026</span>
              <div className="sm:col-span-3 space-y-1">
                <h4 className="text-white font-bold uppercase">Правовая документация</h4>
                <p className="text-slate-400">Опубликовано пользовательское соглашение, политика конфиденциальности и публичная оферта.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
        <p>© 2025–2026 ONCDEV. Разработка <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/polisours/index.html'); }} className="text-slate-300 underline hover:text-white">PoliSours</a> и <a href="https://vobi.bio.link/" target="_blank" className="text-slate-300 underline hover:text-white">Vobi</a>.</p>
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/wiki/index.html'); }} className="hover:text-cyan-400">УСЛОВИЯ</a>
          <span>•</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/wiki/index.html'); }} className="hover:text-cyan-400">ОФЕРТА</a>
          <span>•</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/wiki/index.html'); }} className="hover:text-cyan-400">КОНФИДЕНЦИАЛЬНОСТЬ</a>
        </div>
      </footer>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {cmdOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCmdOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 font-mono text-xs"
            >
              <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
                <Search className="w-4 h-4 text-cyan-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH SYSTEM DIRECTORY..." 
                  className="w-full bg-transparent outline-none text-white placeholder-slate-500 uppercase"
                  autoFocus
                />
                <kbd className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
              </div>

              <div className="p-2 space-y-1 max-h-80 overflow-y-auto uppercase">
                <button onClick={() => navigateTo('/timer/index.html')} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>/01 TIMER TELEMETRY</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => navigateTo('/vpn/index.html')} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    <span>/02 VLESS VPN SYSTEM</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => navigateTo('/wiki/index.html')} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>/03 KNOWLEDGE WIKI</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => navigateTo('/channel-summary/index.html')} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-4 h-4" />
                    <span>/04 YOUTUBE METRICS</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => navigateTo('/about/index.html')} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>/05 CREATORS & POLIMER</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
