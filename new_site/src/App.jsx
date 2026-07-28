import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button3D } from "./components/ui/3d-button";
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Shield, 
  BookOpen, 
  BarChart2, 
  Users,
  Copy,
  Check,
  Upload,
  Phone,
  CreditCard,
  AlertTriangle,
  FileText
} from "lucide-react";

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 99, y: 45 });
  
  // Dynamic View Routing: 'home' | 'vpn' | 'timer' | 'wiki' | 'about'
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/vpn')) return 'vpn';
    if (path.includes('/timer')) return 'timer';
    if (path.includes('/wiki')) return 'wiki';
    if (path.includes('/about')) return 'about';
    if (path.includes('/channel-summary')) return 'summary';
    return 'home';
  });

  // VPN Form State
  const [vpnTab, setVpnTab] = useState('buy');
  const [vpnStep, setVpnStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [username, setUsername] = useState('');
  const [noUsername, setNoUsername] = useState(false);
  const [noTgAccess, setNoTgAccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkCode, setCheckCode] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  const copyToClipboard = (text, label = "Скопировано") => {
    navigator.clipboard.writeText(text);
    setToastMessage(label);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const switchView = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#070709] text-slate-100 font-sans min-h-screen relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Subtle Restrained Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      {/* Blueprint Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#121215_1px,transparent_1px),linear-gradient(to_bottom,#121215_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-60"></div>

      {/* Top Technical HUD Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          
          <button onClick={() => switchView('home')} className="flex items-center gap-3 font-extrabold text-lg tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-xs font-mono font-bold text-slate-950 shadow-md shadow-cyan-500/20">OC</span>
            <span>ONCDEV<span className="text-cyan-400">.</span></span>
          </button>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] text-slate-400">
            <button 
              onClick={() => switchView('home')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'home' ? 'text-cyan-400 font-bold' : ''}`}
            >
              HOME
              {currentView === 'home' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </button>
            <button 
              onClick={() => switchView('timer')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'timer' ? 'text-cyan-400 font-bold' : ''}`}
            >
              PROJECTS / TIMER
              {currentView === 'timer' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </button>
            <button 
              onClick={() => switchView('vpn')}
              className={`relative py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${currentView === 'vpn' ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>VPN LAB
              {currentView === 'vpn' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </button>
            <button 
              onClick={() => switchView('wiki')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'wiki' ? 'text-cyan-400 font-bold' : ''}`}
            >
              DOCS
              {currentView === 'wiki' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </button>
            <button 
              onClick={() => switchView('about')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'about' ? 'text-cyan-400 font-bold' : ''}`}
            >
              ABOUT
              {currentView === 'about' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
            </button>
            <a href="/new_site/polisours/index.html" className="py-1 text-slate-400 hover:text-amber-300 transition-colors">POLISOURS ↗</a>
          </nav>

          {/* Command Search Trigger */}
          <div className="flex items-center gap-6 text-slate-500">
            <span className="hidden sm:inline font-mono text-[10px]">X {coords.x} · Y {coords.y}</span>
            <Button3D
              onClick={() => setCmdOpen(true)}
              className="border border-slate-800 bg-slate-900 px-3.5 py-1.5 rounded-full text-slate-300 hover:border-cyan-500/40 hover:text-white cursor-pointer shadow-lg"
            >
              <span>CMD</span>
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-400 font-mono">⌘K</kbd>
            </Button3D>
          </div>
        </div>
      </header>

      {/* RENDER CURRENT VIEW */}

      {/* VIEW 1: HOME PAGE */}
      {currentView === 'home' && (
        <div className="max-w-[1400px] mx-auto border-x border-slate-800/80">
          
          <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-slate-800/80">
            
            {/* LEFT COLUMN: Giant Bold Typography */}
            <div className="lg:col-span-6 p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between space-y-12">
              
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                  <span>INDEPENDENT DEV TEAM / TEL AVIV & ONLINE</span>
                </div>

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

              {/* Action Box with 3D Rotating Button */}
              <div className="pt-8 border-t border-slate-800/80 space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button3D 
                    onClick={() => switchView('vpn')}
                    className="group border border-cyan-500/40 bg-slate-900/90 px-6 py-4 text-xs font-mono tracking-widest text-cyan-300 uppercase hover:bg-white hover:text-slate-950 hover:border-white cursor-pointer rounded-full shadow-2xl shadow-cyan-500/10"
                  >
                    <span className="font-bold">VPN LAB PORTAL</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button3D>

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

            {/* RIGHT COLUMN: Project Signal Matrix */}
            <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-between space-y-10 bg-slate-950/40">
              <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
                <span className="text-cyan-400 font-semibold">| PROJECT SIGNAL / 2026</span>
                <span>SYSTEM MATRIX</span>
              </div>

              <div className="space-y-4 my-auto divide-y divide-slate-800/50">
                <button onClick={() => switchView('timer')} className="w-full text-left group block pt-4 pb-6 hover:pl-2 transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/01</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">TIMER TELEMETRY</h2>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest">LIVE API</span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">Real-time monitoring since last PolimerS publication.</p>
                </button>

                <button onClick={() => switchView('vpn')} className="w-full text-left group block pt-4 pb-6 hover:pl-2 transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/02</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">VLESS VPN SYSTEM</h2>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 tracking-widest">⚡ 12MS PING</span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">High-speed encrypted protocol node with instant key generation.</p>
                </button>

                <button onClick={() => switchView('wiki')} className="w-full text-left group block pt-4 pb-6 hover:pl-2 transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/03</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">KNOWLEDGE WIKI</h2>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded tracking-widest">DOCS v2.0</span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">Setup guides for iOS, Android, Windows, macOS and legal agreements.</p>
                </button>

                <button onClick={() => switchView('summary')} className="w-full text-left group block pt-4 pb-6 hover:pl-2 transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/04</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">YOUTUBE METRICS</h2>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-widest">ANALYTICS</span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">Channel subscriber metrics and recent publication stream.</p>
                </button>

                <button onClick={() => switchView('about')} className="w-full text-left group block pt-4 pb-6 hover:pl-2 transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">/05</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-white transition-all uppercase tracking-tight">CREATORS & POLIMER</h2>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded tracking-widest">TEAM</span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-2 pl-10 opacity-80 group-hover:opacity-100 transition-opacity">Founders Vobi & Polimer profile showcase and PoliSours resources.</p>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">NODE.JS</span>
                <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">PYTHON & DATA</span>
                <span className="border border-slate-800 px-3 py-1 rounded-full bg-slate-900/60">C++ MATH</span>
                <span className="border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">VLESS PROTOCOL</span>
                <Button3D as="a" href="https://github.com/oncdev-org" target="_blank" rel="noopener noreferrer" className="border border-slate-700 px-3.5 py-1 rounded-full text-white hover:border-cyan-400 hover:text-cyan-300">
                  GITHUB ONCDEV-ORG ↗
                </Button3D>
              </div>
            </div>
          </section>

          {/* Section 01 / Directory */}
          <section className="p-8 lg:p-14 border-b border-slate-800/80 space-y-12">
            <div className="flex items-center justify-between font-mono text-xs text-slate-500 tracking-widest uppercase border-b border-slate-800/80 pb-4">
              <span className="text-cyan-400 font-semibold">| SECTION 01 / ECOSYSTEM DIRECTORY</span>
              <span>EXPLORE PRODUCTS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <span>215д</span><span className="text-slate-600">•</span><span>14ч</span><span className="text-slate-600">•</span><span>32м</span>
                  </div>
                  <Button3D onClick={() => switchView('timer')} className="w-full py-3 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono font-bold tracking-widest text-white uppercase hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer shadow-md">
                    <span>ОТКРЫТЬ ТАЙМЕР</span><ArrowRight className="w-3.5 h-3.5" />
                  </Button3D>
                </div>
              </div>

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
                    <span>⚡ PING: 12ms</span><span className="text-slate-400">UPTIME 99.9%</span>
                  </div>
                  <Button3D onClick={() => switchView('vpn')} className="w-full py-3 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold tracking-widest text-xs uppercase hover:bg-white transition-all cursor-pointer shadow-lg shadow-cyan-500/20">
                    <span>ОФОРМИТЬ VPN</span><ArrowRight className="w-3.5 h-3.5" />
                  </Button3D>
                </div>
              </div>

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
                  <Button3D onClick={() => switchView('wiki')} className="w-full py-3 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono font-bold tracking-widest text-white uppercase hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer shadow-md">
                    <span>ЧИТАТЬ ИНСТРУКЦИИ</span><ArrowRight className="w-3.5 h-3.5" />
                  </Button3D>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* VIEW 2: VPN LAB PAGE */}
      {currentView === 'vpn' && (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>HIGH SPEED VLESS PROTOCOL • 12ms PING</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">oncdev VPN<span className="text-cyan-400">.</span></h1>
            <p class="text-base text-slate-400 max-w-xl leading-relaxed">Безопасный тоннель VLESS для iOS, Android, Windows и macOS без задержек и ограничения скорости.</p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex justify-start">
            <div className="inline-flex p-1 bg-slate-900/90 border border-slate-800 rounded-full font-mono text-xs">
              <button 
                onClick={() => setVpnTab('buy')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all cursor-pointer ${vpnTab === 'buy' ? 'text-white bg-slate-800 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                01 / Оформить подписку
              </button>
              <button 
                onClick={() => setVpnTab('check')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all cursor-pointer ${vpnTab === 'check' ? 'text-white bg-slate-800 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                02 / Забрать ключ
              </button>
            </div>
          </div>

          {/* TAB 1: BUY */}
          {vpnTab === 'buy' && (
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-8 shadow-2xl">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between max-w-md mx-auto font-mono text-xs border-b border-slate-800/80 pb-4">
                <span className={`px-3 py-1 rounded-full ${vpnStep === 1 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-500'}`}>1. ТАРИФ</span>
                <span className={`px-3 py-1 rounded-full ${vpnStep === 2 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-500'}`}>2. АККАУНТ</span>
                <span className={`px-3 py-1 rounded-full ${vpnStep === 3 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-500'}`}>3. ОПЛАТА</span>
                <span className={`px-3 py-1 rounded-full ${vpnStep === 4 ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-500'}`}>4. ГОТОВО</span>
              </div>

              {/* STEP 1: PLANS */}
              {vpnStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Выберите тарифный план:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 1, duration: '1 месяц (30 дней)', price: 50, oldPrice: null, save: null },
                      { id: 2, duration: '3 месяца (90 дней)', price: 140, oldPrice: 150, save: 'СКИДКА 7%' },
                      { id: 3, duration: '6 месяцев (180 дней)', price: 270, oldPrice: 300, save: 'ВЫГОДА 10%' },
                      { id: 4, duration: '12 месяцев (365 дней)', price: 500, oldPrice: 600, save: 'ХИТ • ВЫГОДА 17%' },
                    ].map((plan) => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}`}
                      >
                        <div className="font-bold text-white text-base">{plan.duration}</div>
                        <div className="flex items-baseline gap-2 mt-2">
                          {plan.oldPrice && <span className="line-through text-slate-500 text-sm">{plan.oldPrice} руб.</span>}
                          <span className="text-2xl font-extrabold text-cyan-400 font-mono">{plan.price} руб.</span>
                        </div>
                        {plan.save && <span className="inline-block mt-2 font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{plan.save}</span>}
                      </div>
                    ))}
                  </div>
                  <Button3D
                    onClick={() => selectedPlan && setVpnStep(2)}
                    className="w-full py-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-sm uppercase tracking-wider disabled:opacity-40"
                  >
                    <span>Продолжить к аккаунту →</span>
                  </Button3D>
                </div>
              )}

              {/* STEP 2: ACCOUNT */}
              {vpnStep === 2 && (
                <div className="space-y-6 max-w-lg">
                  <h3 className="text-2xl font-bold text-white">Укажите ваш Telegram аккаунт:</h3>
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-slate-400 uppercase">Юзернейм в Telegram:</label>
                    <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-4 py-3">
                      <span className="text-cyan-400 font-mono font-bold pr-1">@</span>
                      <input 
                        type="text" 
                        placeholder="vobimngr" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full text-sm font-mono" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setVpnStep(1)} className="px-6 py-2.5 rounded-full border border-slate-800 bg-slate-900 text-xs font-mono text-slate-300">← Назад</button>
                    <Button3D onClick={() => setVpnStep(3)} className="px-8 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase">Перейти к оплате →</Button3D>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {vpnStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Реквизиты и загрузка чека:</h3>
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-slate-400">СУММА К ОПЛАТЕ:</span>
                    <div className="text-3xl font-extrabold text-cyan-400 font-mono">{selectedPlan ? selectedPlan.price : 50} руб.</div>
                    <p className="text-xs text-slate-400 font-mono">ОЗОН БАНК (Ozon Bank) • СБП / Карта: <code className="text-cyan-300">+79525908980</code> / <code className="text-cyan-300">2204320380053084</code></p>
                  </div>

                  <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-900/40 space-y-2">
                    <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                    <div className="text-sm font-medium text-white">Загрузите квитанцию или скриншот оплаты</div>
                    <div class="text-xs text-slate-500 font-mono">PNG, JPG, PDF до 10 МБ</div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setVpnStep(2)} className="px-6 py-2.5 rounded-full border border-slate-800 bg-slate-900 text-xs font-mono text-slate-300">← Назад</button>
                    <Button3D onClick={() => setVpnStep(4)} className="px-8 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase">Отправить чек →</Button3D>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {vpnStep === 4 && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl">✓</div>
                  <h3 className="text-3xl font-extrabold text-white">Заявка отправлена!</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto font-mono">Сохраните код заказа для получения VLESS ключа:</p>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-xs mx-auto">
                    <code className="text-3xl font-extrabold font-mono text-cyan-400">A4F9X2</code>
                  </div>
                  <Button3D onClick={() => setVpnTab('check')} className="px-8 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase">Забрать VPN ключ →</Button3D>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CHECK */}
          {vpnTab === 'check' && (
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-6">
              <h2 className="text-2xl font-bold text-white">Забрать VPN ключ по коду:</h2>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="text" 
                  placeholder="Код заказа (напр: A4F9X2)" 
                  value={checkCode}
                  onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 font-mono text-sm text-white uppercase outline-none focus:border-cyan-500" 
                />
                <Button3D onClick={() => setCheckResult('approved')} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase">Проверить</Button3D>
              </div>

              {checkResult === 'approved' && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                  <span className="text-xs font-mono text-emerald-400 font-bold">✓ ОПЛАТА ПОДТВЕРЖДЕНА</span>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <code className="font-mono text-xs text-cyan-300 truncate">vless://oncdev-sub-a4f9x2@node1.oncdev.ru:443?security=reality</code>
                    <button onClick={() => copyToClipboard("vless://oncdev-sub-a4f9x2@node1.oncdev.ru:443?security=reality")} className="text-slate-400 hover:text-white p-1 cursor-pointer"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: TIMER PAGE */}
      {currentView === 'timer' && (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          <div className="space-y-4 border-b border-slate-800/80 pb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>REAL-TIME TELEMETRY</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">Таймер ожидания<span className="text-cyan-400">.</span></h1>
            <p className="text-base text-slate-400">Мониторинг времени с момента выхода последнего видео PolimerS.</p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-4">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">С МОМЕНТА ВЫХОДА ПОСЛЕДНЕГО РОЛИКА ПРОШЛО:</span>
            <div className="text-4xl sm:text-6xl font-mono font-extrabold text-white flex flex-wrap gap-4 items-baseline">
              <span>215</span> <span className="text-slate-500 font-normal text-2xl">дней</span>
              <span>14</span> <span className="text-slate-500 font-normal text-2xl">часов</span>
              <span>32</span> <span className="text-slate-500 font-normal text-2xl">минут</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-3 font-mono">
              <span className="text-xs text-amber-400 font-bold">ЦЕЛЕВАЯ ДАТА</span>
              <h3 className="text-xl font-bold text-white">До 2 июля 2026 года:</h3>
              <div className="text-3xl font-extrabold text-white">125 дней 08 часов</div>
              <p className="text-xs text-slate-500 italic">«Я говорил примерно» — PolimerS</p>
            </div>
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 overflow-hidden">
              <img src="/resources/plat-photo.png" alt="PolimerS" className="w-full h-48 object-cover rounded-2xl filter grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WIKI DOCS PAGE */}
      {currentView === 'wiki' && (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          <div className="space-y-4 border-b border-slate-800/80 pb-8">
            <span className="text-xs font-mono text-cyan-400">DOCUMENTATION HUB v2.0</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">База знаний<span className="text-cyan-400">.</span></h1>
            <p className="text-base text-slate-400">Руководства по настройке VPN и официальная документация.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white font-mono">Смартфоны (iOS / Android)</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">Инструкция по настройке приложения v2rayTun / V2Box для подключения к VLESS серверу.</p>
              <Button3D onClick={() => navigateTo('/wiki/v2ray/index.html')} className="px-6 py-2.5 rounded-full bg-slate-800 text-xs font-mono text-white">Открыть гайд →</Button3D>
            </div>
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white font-mono">Компьютеры (Windows / macOS)</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">Инструкция по настройке программы v2rayN / Nekoray для рабочего стола.</p>
              <Button3D onClick={() => navigateTo('/wiki/v2rayn/index.html')} className="px-6 py-2.5 rounded-full bg-slate-800 text-xs font-mono text-white">Открыть гайд →</Button3D>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: ABOUT CREATORS PAGE */}
      {currentView === 'about' && (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          <div className="space-y-4 border-b border-slate-800/80 pb-8">
            <span className="text-xs font-mono text-cyan-400">FOUNDERS DIRECTORY</span>
            <h1 class="text-4xl sm:text-6xl font-extrabold text-white">О создателях<span className="text-cyan-400">.</span></h1>
            <p className="text-base text-slate-400">Объединение oncdev основано Vobi и Polimer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
              <img src="/about/vobi-photo.jpg" alt="Vobi" className="w-20 h-20 rounded-full border-2 border-cyan-500/30 object-cover" />
              <h3 className="text-2xl font-bold text-white font-mono">Vobi</h3>
              <p className="text-xs text-slate-400 font-mono">Основатель oncdev. Веб-разработка, прикладной софт, интерфейсы и UI craft.</p>
              <a href="https://vobi.bio.link" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-mono text-cyan-400 hover:underline">Профиль Vobi ↗</a>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
              <img src="/about/polimer-photo.jpg" alt="Polimer" className="w-20 h-20 rounded-full border-2 border-amber-500/30 object-cover" />
              <h3 className="text-2xl font-bold text-white font-mono">Polimer</h3>
              <p className="text-xs text-slate-400 font-mono">Основатель oncdev и автор канала PolimerS. Backend-разработчик, ИИ и прикладная математика.</p>
              <a href="https://t.me/polisour/68" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-mono text-amber-400 hover:underline">Профиль Polimer ↗</a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
        <p>© 2025–2026 ONCDEV. Разработка <a href="/new_site/polisours/index.html" className="text-slate-300 underline hover:text-white">PoliSours</a> и <a href="https://vobi.bio.link/" target="_blank" className="text-slate-300 underline hover:text-white">Vobi</a>.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => switchView('wiki')} className="hover:text-cyan-400 cursor-pointer">УСЛОВИЯ</button>
          <span>•</span>
          <button onClick={() => switchView('wiki')} className="hover:text-cyan-400 cursor-pointer">ОФЕРТА</button>
          <span>•</span>
          <button onClick={() => switchView('wiki')} className="hover:text-cyan-400 cursor-pointer">КОНФИДЕНЦИАЛЬНОСТЬ</button>
        </div>
      </footer>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
                <button onClick={() => { switchView('timer'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>/01 TIMER TELEMETRY</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('vpn'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    <span>/02 VLESS VPN SYSTEM</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('wiki'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>/03 KNOWLEDGE WIKI</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('summary'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-4 h-4" />
                    <span>/04 YOUTUBE METRICS</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('about'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-cyan-500 hover:text-slate-950 transition-colors rounded-xl text-slate-200 cursor-pointer">
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
