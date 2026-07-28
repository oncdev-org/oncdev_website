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
  
  // Dynamic View Routing: 'home' | 'vpn' | 'timer' | 'wiki' | 'about' | 'summary'
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
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiCat, setWikiCat] = useState('all');

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
    <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen relative selection:bg-white selection:text-black">
      
      {/* Blueprint Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-70"></div>

      {/* Top Technical HUD Bar */}
      <header className="border-b border-[#1c1c1c] bg-[#050505]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          
          <button onClick={() => switchView('home')} className="font-extrabold text-lg tracking-tighter text-white hover:opacity-80 transition-opacity cursor-pointer">
            ONCDEV<span className="text-neutral-500">.</span>
          </button>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] text-neutral-400">
            <button 
              onClick={() => switchView('home')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'home' ? 'text-white font-bold' : ''}`}
            >
              HOME
              {currentView === 'home' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
            </button>
            <button 
              onClick={() => switchView('timer')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'timer' ? 'text-white font-bold' : ''}`}
            >
              PROJECTS / TIMER
              {currentView === 'timer' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
            </button>
            <button 
              onClick={() => switchView('vpn')}
              className={`relative py-1 transition-colors cursor-pointer ${currentView === 'vpn' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              VPN LAB
              {currentView === 'vpn' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
            </button>
            <button 
              onClick={() => switchView('wiki')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'wiki' ? 'text-white font-bold' : ''}`}
            >
              DOCS
              {currentView === 'wiki' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
            </button>
            <button 
              onClick={() => switchView('about')}
              className={`relative py-1 transition-colors hover:text-white cursor-pointer ${currentView === 'about' ? 'text-white font-bold' : ''}`}
            >
              ABOUT
              {currentView === 'about' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
            </button>
            <a href="./polisours/index.html" className="py-1 hover:text-white transition-colors">POLISOURS ↗</a>
          </nav>

          {/* Command Search Trigger */}
          <div className="flex items-center gap-6 text-neutral-500">
            <span className="hidden sm:inline font-mono text-[10px]">X {coords.x} · Y {coords.y}</span>
            <Button3D
              onClick={() => setCmdOpen(true)}
              className="border border-[#222222] bg-[#0a0a0a] px-3.5 py-1.5 rounded text-neutral-300 hover:border-white hover:text-white transition-all cursor-pointer"
            >
              <span>CMD</span>
              <kbd className="bg-[#181818] px-1.5 py-0.5 rounded text-[9px] text-neutral-400 font-mono">⌘K</kbd>
            </Button3D>
          </div>
        </div>
      </header>

      {/* RENDER CURRENT VIEW */}

      {/* VIEW 1: HOME PAGE */}
      {currentView === 'home' && (
        <div className="max-w-[1400px] mx-auto border-x border-[#1c1c1c]">
          
          <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-[#1c1c1c]">
            
            {/* LEFT COLUMN: Giant Bold Typography */}
            <div className="lg:col-span-6 p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#1c1c1c] flex flex-col justify-between space-y-12">
              
              <div className="space-y-8">
                <div className="font-mono text-xs text-neutral-500 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>INDEPENDENT DEV TEAM / TEL AVIV & ONLINE</span>
                </div>

                <h1 className="text-5xl sm:text-7xl xl:text-[5.2rem] font-extrabold text-white tracking-tighter leading-[0.92] uppercase font-sans">
                  WE BUILD<br />
                  TOOLS THAT<br />
                  SERVE THE<br />
                  COMMUNITY<span className="text-neutral-600">.</span>
                </h1>

                <p className="text-sm text-neutral-400 max-w-md font-mono leading-relaxed uppercase tracking-wide">
                  ATMOSPHERIC INDIE TOOLS, TELEMETRY TIMERS AND SECURE INFRASTRUCTURE SYSTEMS.
                </p>
              </div>

              {/* Action Box with 3D Rotating Button */}
              <div className="pt-8 border-t border-[#1c1c1c] space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button3D 
                    onClick={() => switchView('vpn')}
                    className="group border border-white/30 bg-transparent px-6 py-4 text-xs font-mono tracking-widest text-white uppercase hover:bg-white hover:text-black flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className="font-bold">VPN LAB PORTAL</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button3D>

                  <div className="border border-[#1c1c1c] bg-[#0a0a0a] p-3 text-[10px] font-mono text-neutral-400 space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>CURRENTLY</span>
                    </div>
                    <p className="text-neutral-500">BUILDING REAL-TIME TELEMETRY & VLESS VPN PROTOCOL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Project Signal Matrix */}
            <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-between space-y-10 bg-[#070707]">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-500 tracking-widest uppercase border-b border-[#1c1c1c] pb-4">
                <span>| PROJECT SIGNAL / 2026</span>
                <span>SYSTEM MATRIX</span>
              </div>

              <div className="space-y-4 my-auto">
                <button onClick={() => switchView('timer')} className="w-full text-left group block border-b border-[#1c1c1c] pb-6 pt-3 hover:border-white transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">/01</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all uppercase tracking-tight">TIMER TELEMETRY</h2>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white transition-colors tracking-widest">LIVE API</span>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">Real-time monitoring since last PolimerS publication.</p>
                </button>

                <button onClick={() => switchView('vpn')} className="w-full text-left group block border-b border-[#1c1c1c] pb-6 pt-3 hover:border-white transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">/02</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all uppercase tracking-tight">VLESS VPN SYSTEM</h2>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 group-hover:text-emerald-300 transition-colors tracking-widest">ACTIVE 12MS</span>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">High-speed encrypted protocol node with instant key generation.</p>
                </button>

                <button onClick={() => switchView('wiki')} className="w-full text-left group block border-b border-[#1c1c1c] pb-6 pt-3 hover:border-white transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">/03</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all uppercase tracking-tight">KNOWLEDGE WIKI</h2>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white transition-colors tracking-widest">DOCS v2.0</span>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">Setup guides for iOS, Android, Windows, macOS and legal agreements.</p>
                </button>

                <button onClick={() => switchView('summary')} className="w-full text-left group block border-b border-[#1c1c1c] pb-6 pt-3 hover:border-white transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">/04</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all uppercase tracking-tight">YOUTUBE METRICS</h2>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white transition-colors tracking-widest">ANALYTICS</span>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">Channel subscriber metrics and recent publication stream.</p>
                </button>

                <button onClick={() => switchView('about')} className="w-full text-left group block border-b border-[#1c1c1c] pb-6 pt-3 hover:border-white transition-all duration-200 cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">/05</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all uppercase tracking-tight">CREATORS & POLIMER</h2>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white transition-colors tracking-widest">TEAM</span>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">Founders Vobi & Polimer profile showcase and PoliSours resources.</p>
                </button>
              </div>

              <div className="pt-6 border-t border-[#1c1c1c] flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500">
                <span className="border border-[#1f1f1f] px-2.5 py-1 rounded bg-[#0a0a0a]">NODE.JS</span>
                <span className="border border-[#1f1f1f] px-2.5 py-1 rounded bg-[#0a0a0a]">PYTHON & DATA</span>
                <span className="border border-[#1f1f1f] px-2.5 py-1 rounded bg-[#0a0a0a]">C++ MATH</span>
                <span className="border border-[#1f1f1f] px-2.5 py-1 rounded bg-[#0a0a0a]">VLESS PROTOCOL</span>
                <Button3D as="a" href="https://github.com/oncdev-org" target="_blank" rel="noopener noreferrer" className="border border-white/20 px-2.5 py-1 rounded text-white hover:bg-white hover:text-black transition-colors">
                  GITHUB ONCDEV-ORG ↗
                </Button3D>
              </div>
            </div>
          </section>

          {/* Section 01 / Directory */}
          <section className="p-8 lg:p-14 border-b border-[#1c1c1c] space-y-12">
            <div className="flex items-center justify-between font-mono text-xs text-neutral-500 tracking-widest uppercase border-b border-[#1c1c1c] pb-4">
              <span>| SECTION 01 / ECOSYSTEM DIRECTORY</span>
              <span>EXPLORE PRODUCTS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-6 flex flex-col justify-between hover:border-white transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                    <span>01 // TELEMETRY</span>
                    <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> LIVE</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase group-hover:translate-x-1 transition-transform">Таймер ожидания</h3>
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">Мониторинг точного интервала времени с момента выхода последнего видео PolimerS и целевые даты.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-[#0a0a0a] border border-[#1c1c1c] font-mono text-xs text-white flex justify-around">
                    <span>215д</span><span className="text-neutral-600">•</span><span>14ч</span><span className="text-neutral-600">•</span><span>32м</span>
                  </div>
                  <Button3D onClick={() => switchView('timer')} className="w-full py-3 border border-white/20 bg-transparent text-xs font-mono tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>ОТКРЫТЬ ТАЙМЕР</span><ArrowRight className="w-3.5 h-3.5" />
                  </Button3D>
                </div>
              </div>

              <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-6 flex flex-col justify-between hover:border-white transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                    <span>02 // NETWORK</span>
                    <span className="text-white border border-white/20 px-2 py-0.5 text-[10px]">VLESS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase group-hover:translate-x-1 transition-transform">VPN-сервис</h3>
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">Высокоскоростной и защищенный доступ в интернет на протоколах VLESS с пошаговой выдачей ключа.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-[#0a0a0a] border border-[#1c1c1c] font-mono text-xs text-emerald-400 flex items-center justify-between">
                    <span>⚡ PING: 12ms</span><span className="text-neutral-500">UPTIME 99.9%</span>
                  </div>
                  <Button3D onClick={() => switchView('vpn')} className="w-full py-3 border border-white/20 bg-transparent text-xs font-mono tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>ОФОРМИТЬ VPN</span><ArrowRight className="w-3.5 h-3.5" />
                  </Button3D>
                </div>
              </div>

              <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-6 flex flex-col justify-between hover:border-white transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                    <span>03 // KNOWLEDGE</span>
                    <span className="text-neutral-400">v2.0 DOCS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase group-hover:translate-x-1 transition-transform">База знаний</h3>
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">Инструкции по настройке VPN для устройств, пользовательские соглашения и оферта.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-[#0a0a0a] border border-[#1c1c1c] font-mono text-xs text-neutral-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Interactive Guides Hub</span>
                  </div>
                  <Button3D onClick={() => switchView('wiki')} className="w-full py-3 border border-white/20 bg-transparent text-xs font-mono tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2">
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
        <div className="max-w-[1400px] mx-auto border-x border-[#1c1c1c] p-8 lg:p-14 space-y-12 min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 border-b border-[#1c1c1c] pb-10">
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>| HIGH SPEED VLESS PROTOCOL • 12ms PING</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white uppercase">oncdev VPN<span className="text-neutral-600">.</span></h1>
            <p className="text-xs font-mono text-neutral-400 max-w-xl uppercase tracking-wider">Безопасный тоннель VLESS для iOS, Android, Windows и macOS без задержек и ограничения скорости.</p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex justify-start">
            <div className="inline-flex p-1 bg-[#0a0a0a] border border-[#1c1c1c] rounded font-mono text-xs">
              <button 
                onClick={() => setVpnTab('buy')}
                className={`px-6 py-2.5 font-bold uppercase transition-all cursor-pointer ${vpnTab === 'buy' ? 'text-black bg-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
              >
                01 / Оформить подписку
              </button>
              <button 
                onClick={() => setVpnTab('check')}
                className={`px-6 py-2.5 font-bold uppercase transition-all cursor-pointer ${vpnTab === 'check' ? 'text-black bg-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
              >
                02 / Забрать ключ
              </button>
            </div>
          </div>

          {/* TAB 1: BUY */}
          {vpnTab === 'buy' && (
            <div className="p-8 lg:p-12 border border-[#1c1c1c] bg-[#080808] space-y-8 font-mono">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between max-w-xl mx-auto text-xs border-b border-[#1c1c1c] pb-6">
                <span className={`px-3 py-1 border ${vpnStep === 1 ? 'border-white text-white font-bold bg-white/10' : 'border-transparent text-neutral-500'}`}>1. ТАРИФ</span>
                <span className={`px-3 py-1 border ${vpnStep === 2 ? 'border-white text-white font-bold bg-white/10' : 'border-transparent text-neutral-500'}`}>2. АККАУНТ</span>
                <span className={`px-3 py-1 border ${vpnStep === 3 ? 'border-white text-white font-bold bg-white/10' : 'border-transparent text-neutral-500'}`}>3. ОПЛАТА</span>
                <span className={`px-3 py-1 border ${vpnStep === 4 ? 'border-emerald-400 text-emerald-400 font-bold bg-emerald-500/10' : 'border-transparent text-neutral-500'}`}>4. ГОТОВО</span>
              </div>

              {/* STEP 1: PLANS */}
              {vpnStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white uppercase">Выберите тарифный план:</h3>
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
                        className={`p-6 border cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-white bg-white/10' : 'border-[#1c1c1c] bg-[#050505] hover:border-white/40'}`}
                      >
                        <div className="font-bold text-white text-base uppercase">{plan.duration}</div>
                        <div className="flex items-baseline gap-3 mt-3 font-mono">
                          {plan.oldPrice && <span className="line-through text-neutral-500 text-sm">{plan.oldPrice} руб.</span>}
                          <span className="text-3xl font-extrabold text-white">{plan.price} руб.</span>
                        </div>
                        {plan.save && <span className="inline-block mt-3 text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5">{plan.save}</span>}
                      </div>
                    ))}
                  </div>
                  <Button3D
                    onClick={() => selectedPlan && setVpnStep(2)}
                    className="w-full py-4 border border-white/30 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Продолжить к аккаунту →</span>
                  </Button3D>
                </div>
              )}

              {/* STEP 2: ACCOUNT */}
              {vpnStep === 2 && (
                <div className="space-y-6 max-w-lg">
                  <h3 className="text-xl font-bold text-white uppercase">Укажите ваш Telegram аккаунт:</h3>
                  <div className="space-y-4">
                    <label className="block text-xs text-neutral-400 uppercase">Юзернейм в Telegram:</label>
                    <div className="flex items-center bg-[#0a0a0a] border border-[#1c1c1c] px-4 py-3">
                      <span className="text-white font-mono font-bold pr-1">@</span>
                      <input 
                        type="text" 
                        placeholder="vobimngr" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full text-sm font-mono uppercase" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setVpnStep(1)} className="px-6 py-2.5 border border-[#1c1c1c] bg-[#0a0a0a] text-xs text-neutral-300 hover:text-white uppercase cursor-pointer">← Назад</button>
                    <Button3D onClick={() => setVpnStep(3)} className="px-8 py-3 border border-white/30 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200">Перейти к оплате →</Button3D>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {vpnStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white uppercase">Реквизиты и загрузка чека:</h3>
                  <div className="p-6 bg-[#050505] border border-[#1c1c1c] space-y-2">
                    <span className="text-xs text-neutral-400 uppercase">СУММА К ОПЛАТЕ:</span>
                    <div className="text-3xl font-extrabold text-white font-mono">{selectedPlan ? selectedPlan.price : 50} руб.</div>
                    <p className="text-xs text-neutral-400 font-mono">ОЗОН БАНК (Ozon Bank) • СБП / Карта: <code className="text-white">+79525908980</code> / <code className="text-white">2204320380053084</code></p>
                  </div>

                  <div className="p-8 border border-dashed border-[#1c1c1c] text-center bg-[#050505] space-y-2">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                    <div className="text-sm font-medium text-white uppercase">Загрузите квитанцию или скриншот оплаты</div>
                    <div className="text-xs text-neutral-500 font-mono">PNG, JPG, PDF до 10 МБ</div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setVpnStep(2)} className="px-6 py-2.5 border border-[#1c1c1c] bg-[#0a0a0a] text-xs text-neutral-300 hover:text-white uppercase cursor-pointer">← Назад</button>
                    <Button3D onClick={() => setVpnStep(4)} className="px-8 py-3 border border-white/30 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200">Отправить чек →</Button3D>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {vpnStep === 4 && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl">✓</div>
                  <h3 className="text-3xl font-extrabold text-white uppercase">Заявка отправлена!</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto font-mono uppercase">Сохраните код заказа для получения VLESS ключа:</p>
                  <div className="p-4 bg-[#050505] border border-[#1c1c1c] max-w-xs mx-auto">
                    <code className="text-3xl font-extrabold font-mono text-white">A4F9X2</code>
                  </div>
                  <Button3D onClick={() => setVpnTab('check')} className="px-8 py-3 border border-white/30 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200">Забрать VPN ключ →</Button3D>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CHECK */}
          {vpnTab === 'check' && (
            <div className="p-8 lg:p-12 border border-[#1c1c1c] bg-[#080808] space-y-6 font-mono">
              <h2 className="text-2xl font-bold text-white uppercase">Забрать VPN ключ по коду:</h2>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="text" 
                  placeholder="Код заказа (напр: A4F9X2)" 
                  value={checkCode}
                  onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#0a0a0a] border border-[#1c1c1c] px-4 py-3 text-xs text-white uppercase outline-none focus:border-white" 
                />
                <Button3D onClick={() => setCheckResult('approved')} className="px-6 py-3 border border-white/30 bg-white text-black font-bold text-xs uppercase">Проверить</Button3D>
              </div>

              {checkResult === 'approved' && (
                <div className="p-6 bg-[#050505] border border-[#1c1c1c] space-y-4 max-w-xl">
                  <span className="text-xs text-emerald-400 font-bold">✓ ОПЛАТА ПОДТВЕРЖДЕНА</span>
                  <div className="p-3.5 bg-[#0a0a0a] border border-[#1c1c1c] flex items-center justify-between gap-3">
                    <code className="font-mono text-xs text-white truncate">vless://oncdev-sub-a4f9x2@node1.oncdev.ru:443?security=reality</code>
                    <button onClick={() => copyToClipboard("vless://oncdev-sub-a4f9x2@node1.oncdev.ru:443?security=reality")} className="text-neutral-400 hover:text-white p-1 cursor-pointer"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: TIMER PAGE */}
      {currentView === 'timer' && (
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14 space-y-16 border-x border-[#1c1c1c] min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 border-b border-[#1c1c1c] pb-10">
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>| TELEMETRY SIGNAL / YOUTUBE API LIVE</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white uppercase">Таймер ожидания<span className="text-neutral-600">.</span></h1>
            <p className="text-xs font-mono text-neutral-400 max-w-xl uppercase tracking-wider">Мониторинг точного интервала времени с момента выхода последнего видео PolimerS и целевые даты.</p>
          </div>

          <div className="p-8 lg:p-12 border border-[#1c1c1c] bg-[#080808] space-y-4">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">С МОМЕНТА ВЫХОДА ПОСЛЕДНЕГО РОЛИКА ПРОШЛО:</span>
            <div className="text-3xl sm:text-6xl font-mono font-bold tracking-tight text-white flex flex-wrap gap-x-6 gap-y-4 items-baseline uppercase">
              <span>215</span> <span className="text-neutral-500 font-normal text-xl sm:text-3xl">дней</span>
              <span>14</span> <span className="text-neutral-500 font-normal text-xl sm:text-3xl">часов</span>
              <span>32</span> <span className="text-neutral-500 font-normal text-xl sm:text-3xl">минут</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-[#1c1c1c]">
            <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-4 font-mono">
              <span className="text-xs text-neutral-500 tracking-widest uppercase">ЦЕЛЕВАЯ ДАТА</span>
              <h3 className="text-xl font-bold text-white uppercase">До 2 июля 2026 года:</h3>
              <div className="text-3xl font-extrabold text-white">125 дней 08 часов</div>
              <p className="text-xs text-neutral-500 italic pt-2">«Я говорил примерно» — PolimerS</p>
            </div>
            <div className="border border-[#1c1c1c] bg-[#080808] p-4 flex flex-col justify-between">
              <div className="relative overflow-hidden border border-[#1c1c1c] bg-[#050505]">
                <img src="/resources/plat-photo.png" alt="PolimerS" className="w-full h-64 object-cover object-top opacity-80 hover:opacity-100 transition-opacity filter grayscale" />
                <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/90 px-3 py-1 text-white border border-[#222222]">АРХИВ • 7 ЯНВАРЯ 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WIKI DOCS PAGE */}
      {currentView === 'wiki' && (
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14 space-y-12 border-x border-[#1c1c1c] min-h-[calc(100vh-4rem)]">
          {/* Header Section */}
          <div className="space-y-6 border-b border-[#1c1c1c] pb-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>| DOCUMENTATION & SETUP KNOWLEDGE BASE</span>
              </div>
              <div className="font-mono text-xs text-neutral-400">
                ВЕРСИЯ 2.4 • ОБНОВЛЕНО 2026
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white uppercase">База знаний<span className="text-neutral-600">.</span></h1>
            <p className="text-xs font-mono text-neutral-400 max-w-2xl uppercase tracking-wider leading-relaxed">Быстрые и наглядные руководства по настройке VLESS VPN для смартфонов и ПК, а также правовые документы oncdev.</p>

            {/* Search & Filter Controls */}
            <div className="pt-4 space-y-4 max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                <input 
                  type="text" 
                  value={wikiQuery}
                  onChange={(e) => setWikiQuery(e.target.value)}
                  placeholder="Быстрый поиск по базе знаний (например: iOS, Android, Windows, v2ray, offer...)" 
                  className="w-full bg-[#0a0a0a] border border-[#1c1c1c] focus:border-white text-white font-mono text-xs pl-11 pr-4 py-3.5 outline-none transition-colors" 
                />
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <button 
                  onClick={() => setWikiCat('all')} 
                  className={`px-4 py-1.5 border uppercase transition-all cursor-pointer ${wikiCat === 'all' ? 'border-white bg-white text-black font-bold' : 'border-[#1c1c1c] bg-[#0a0a0a] text-neutral-400 hover:text-white'}`}
                >
                  ВСЕ
                </button>
                <button 
                  onClick={() => setWikiCat('mobile')} 
                  className={`px-4 py-1.5 border uppercase transition-all cursor-pointer ${wikiCat === 'mobile' ? 'border-white bg-white text-black font-bold' : 'border-[#1c1c1c] bg-[#0a0a0a] text-neutral-400 hover:text-white'}`}
                >
                  📱 СМАРТФОНЫ
                </button>
                <button 
                  onClick={() => setWikiCat('desktop')} 
                  className={`px-4 py-1.5 border uppercase transition-all cursor-pointer ${wikiCat === 'desktop' ? 'border-white bg-white text-black font-bold' : 'border-[#1c1c1c] bg-[#0a0a0a] text-neutral-400 hover:text-white'}`}
                >
                  💻 КОМПЬЮТЕРЫ
                </button>
                <button 
                  onClick={() => setWikiCat('legal')} 
                  className={`px-4 py-1.5 border uppercase transition-all cursor-pointer ${wikiCat === 'legal' ? 'border-white bg-white text-black font-bold' : 'border-[#1c1c1c] bg-[#0a0a0a] text-neutral-400 hover:text-white'}`}
                >
                  📜 ДОКУМЕНТЫ
                </button>
              </div>
            </div>
          </div>

          {/* Quick Express VPN Installation Cards */}
          {(wikiCat === 'all' || wikiCat === 'mobile' || wikiCat === 'desktop') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 uppercase tracking-widest">/ EXPRESS QUICK-START GUIDES</span>
                <span className="text-emerald-400 font-bold">● VLESS READY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Guide Card 1: iOS */}
                {(wikiCat === 'all' || wikiCat === 'mobile') && 
                 (!wikiQuery || 'ios iphone ipad v2ray v2raytun v2box vless mobile'.includes(wikiQuery.toLowerCase())) && (
                  <div className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#222] bg-[#0d0d0d] flex items-center justify-center text-white text-lg">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white font-mono uppercase">iOS (iPhone / iPad)</h3>
                          <span className="text-[10px] font-mono text-neutral-500">Клиенты: v2rayTun, V2Box, Streisand</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">ПОПУЛЯРНОЕ</span>
                    </div>

                    <ol className="space-y-2.5 font-mono text-xs text-neutral-300">
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Скопируйте полученную VLESS ссылку из бота или сайта.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Установите бесплатное приложение <b>v2rayTun</b> в App Store.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Нажмите значок <b>«+»</b> и выберите <b>«Вставить из буфера»</b>.</span>
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1c1c1c]">
                      <Button3D onClick={() => window.location.href = './wiki/v2ray/index.html'} className="px-5 py-2 border border-white/20 bg-transparent text-xs text-white uppercase hover:bg-white hover:text-black">
                        Полный иллюстрированный гайд ↗
                      </Button3D>
                    </div>
                  </div>
                )}

                {/* Guide Card 2: Android */}
                {(wikiCat === 'all' || wikiCat === 'mobile') && 
                 (!wikiQuery || 'android samsung xiaomi v2ray v2raytun nekobox vless mobile'.includes(wikiQuery.toLowerCase())) && (
                  <div className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#222] bg-[#0d0d0d] flex items-center justify-center text-white text-lg">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white font-mono uppercase">Android (Смартфоны)</h3>
                          <span className="text-[10px] font-mono text-neutral-500">Клиенты: v2rayTun, NekoBox, v2rayNG</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">ПОПУЛЯРНОЕ</span>
                    </div>

                    <ol className="space-y-2.5 font-mono text-xs text-neutral-300">
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Скопируйте ключ подписки VLESS.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Скачайте <b>v2rayTun</b> из Google Play или APK со страницы релиза.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Импортируйте профиль из буфера обмена и нажмите кнопку подключения.</span>
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1c1c1c]">
                      <Button3D onClick={() => window.location.href = './wiki/v2ray/index.html'} className="px-5 py-2 border border-white/20 bg-transparent text-xs text-white uppercase hover:bg-white hover:text-black">
                        Полный иллюстрированный гайд ↗
                      </Button3D>
                    </div>
                  </div>
                )}

                {/* Guide Card 3: Windows */}
                {(wikiCat === 'all' || wikiCat === 'desktop') && 
                 (!wikiQuery || 'windows pc laptop v2rayn nekoray hiddify vless desktop'.includes(wikiQuery.toLowerCase())) && (
                  <div className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#222] bg-[#0d0d0d] flex items-center justify-center text-white text-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white font-mono uppercase">Windows (ПК / Ноутбуки)</h3>
                          <span className="text-[10px] font-mono text-neutral-500">Клиенты: v2rayN, Nekoray, Hiddify</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-white/10 border border-white/20 text-white font-bold">БЫСТРЫЙ СТАРТ</span>
                    </div>

                    <ol className="space-y-2.5 font-mono text-xs text-neutral-300">
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Загрузите и распакуйте архиватор <b>v2rayN</b>.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Скопируйте VLESS ссылку и нажмите <b>Ctrl+V</b> в главном окне.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Включите пункт <b>«Системный прокси»</b> внизу программы.</span>
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1c1c1c]">
                      <Button3D onClick={() => window.location.href = './wiki/v2rayn/index.html'} className="px-5 py-2 border border-white/20 bg-transparent text-xs text-white uppercase hover:bg-white hover:text-black">
                        Полный гайд для Windows ↗
                      </Button3D>
                    </div>
                  </div>
                )}

                {/* Guide Card 4: macOS */}
                {(wikiCat === 'all' || wikiCat === 'desktop') && 
                 (!wikiQuery || 'mac macos macbook foxray v2box nekoray vless desktop'.includes(wikiQuery.toLowerCase())) && (
                  <div className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#222] bg-[#0d0d0d] flex items-center justify-center text-white text-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white font-mono uppercase">macOS (MacBook / iMac)</h3>
                          <span className="text-[10px] font-mono text-neutral-500">Клиенты: FoXray, V2Box, Nekoray</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-white/10 border border-white/20 text-white font-bold">БЫСТРЫЙ СТАРТ</span>
                    </div>

                    <ol className="space-y-2.5 font-mono text-xs text-neutral-300">
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Установите <b>FoXray</b> или <b>V2Box</b> из Mac App Store.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Скопируйте VLESS ссылку в буфер обмена.</span>
                      </li>
                      <li class="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-[#121212] border border-[#222] text-neutral-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Импортируйте ссылку и разрешите добавление VPN конфигурации в macOS.</span>
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1c1c1c]">
                      <Button3D onClick={() => window.location.href = './wiki/v2rayn/index.html'} className="px-5 py-2 border border-white/20 bg-transparent text-xs text-white uppercase hover:bg-white hover:text-black">
                        Полный гайд для macOS ↗
                      </Button3D>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* Legal Documents Section */}
          {(wikiCat === 'all' || wikiCat === 'legal') && (
            <section className="space-y-6 pt-6 border-t border-[#1c1c1c]">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                / 02 LEGAL DOCUMENTS & POLICIES
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="./wiki/tos/index.html" className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-4 block group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-white" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase group-hover:translate-x-1 transition-transform">Пользовательское соглашение</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 leading-relaxed uppercase">Правила использования сервиса oncdev VPN, обязанности сторон и порядок оказания услуг.</p>
                  <div className="pt-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">ОТКРЫТЬ ДОКУМЕНТ ↗</div>
                </a>

                <a href="./wiki/privacy/index.html" className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-4 block group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase group-hover:translate-x-1 transition-transform">Конфиденциальность</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 leading-relaxed uppercase">Политика шифрования, отсутствие логов трафика (No-Logs Policy) и защита данных.</p>
                  <div className="pt-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">ОТКРЫТЬ ДОКУМЕНТ ↗</div>
                </a>

                <a href="./wiki/refund/index.html" className="p-6 border border-[#1c1c1c] bg-[#080808] hover:border-white transition-all space-y-4 block group">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-white" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase group-hover:translate-x-1 transition-transform">Публичная оферта & Возврат</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 leading-relaxed uppercase">Условия публичной оферты, способы оплаты СБП / Картами и регламент возврата средств.</p>
                  <div className="pt-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">ОТКРЫТЬ ДОКУМЕНТ ↗</div>
                </a>
              </div>
            </section>
          )}
        </div>
      )}

      {/* VIEW 5: ABOUT CREATORS PAGE - MONOCHROME KLTZQU WITH FULL COLOR AVATARS */}
      {currentView === 'about' && (
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14 space-y-16 border-x border-[#1c1c1c] min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 border-b border-[#1c1c1c] pb-10">
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>| FOUNDERS & CREATORS DIRECTORY</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white uppercase">О создателях<span className="text-neutral-600">.</span></h1>
            <p className="text-xs font-mono text-neutral-400 max-w-xl uppercase tracking-wider">Объединение oncdev основано Vobi и Polimer.</p>
          </div>

          <div className="divide-y divide-[#1c1c1c]">
            {/* Vobi */}
            <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex items-center gap-6">
                <img src="/about/vobi-photo.jpg" alt="Vobi" className="w-24 h-24 rounded-full object-cover border border-neutral-700 filter-none hover:scale-105 transition-all" />
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] border border-white/20 px-2.5 py-0.5 rounded text-white font-bold">FOUNDER</span>
                  <h2 className="text-3xl font-extrabold text-white uppercase">Vobi</h2>
                  <p className="text-xs text-neutral-500">AKA sup, sunny / meforr</p>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6 font-mono">
                <p className="text-sm text-neutral-300 leading-relaxed uppercase">
                  Основатель oncdev. Проектирование веб-сервисов, разработка прикладного ПО, проектирование пользовательского опыта и чистая архитектура.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">WEB DEVELOPMENT</span>
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">APPLIED SOFTWARE</span>
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">UI & UX CRAFT</span>
                </div>
                <div className="pt-2">
                  <a href="https://vobi.bio.link" target="_blank" rel="noopener noreferrer" className="border border-white/20 px-4 py-2 text-xs text-white uppercase hover:bg-white hover:text-black transition-all inline-block">
                    ПРОФИЛЬ VOBI ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Polimer */}
            <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex items-center gap-6">
                <img src="/about/polimer-photo.jpg" alt="Polimer" className="w-24 h-24 rounded-full object-cover border border-neutral-700 filter-none hover:scale-105 transition-all" />
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] border border-white/20 px-2.5 py-0.5 rounded text-white font-bold">FOUNDER</span>
                  <h2 className="text-3xl font-extrabold text-white uppercase">Polimer</h2>
                  <p className="text-xs text-neutral-500">AKA PolimerS / PoliSours</p>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6 font-mono">
                <p className="text-sm text-neutral-300 leading-relaxed uppercase">
                  Основатель oncdev и автор канала PolimerS. Backend-разработчик, специалист по искусственному интеллекту, прикладной математике и анализу данных.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">BACKEND SYSTEMS</span>
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">AI & MATHEMATICS</span>
                  <span className="border border-[#1f1f1f] px-3 py-1 bg-[#0a0a0a] text-neutral-400">YOUTUBE CREATOR</span>
                </div>
                <div className="pt-2">
                  <a href="https://t.me/polisour/68" target="_blank" rel="noopener noreferrer" className="border border-white/20 px-4 py-2 text-xs text-white uppercase hover:bg-white hover:text-black transition-all inline-block">
                    ПРОФИЛЬ POLIMER ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: SUMMARY PAGE */}
      {currentView === 'summary' && (
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14 space-y-16 border-x border-[#1c1c1c] min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-8 border-b border-[#1c1c1c] pb-10">
            <img src="/resources/plat-photo.png" alt="PolimerS" className="w-24 h-24 rounded-full object-cover border border-neutral-700 filter grayscale" />
            <div className="space-y-3 font-mono">
              <div className="flex items-center gap-2 text-xs text-neutral-500 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                <span>YOUTUBE CHANNEL METRICS</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white uppercase">PolimerS<span className="text-neutral-600">.</span></h1>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Официальный YouTube-канал с видео, модами и технологическими обзорами.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-3 font-mono">
              <span className="text-xs text-neutral-500 tracking-widest uppercase">ПОДПИСЧИКИ</span>
              <strong className="block font-mono text-4xl sm:text-6xl font-extrabold text-white tracking-tight">24.8K</strong>
            </div>
            <div className="border border-[#1c1c1c] bg-[#080808] p-8 space-y-3 font-mono">
              <span className="text-xs text-neutral-500 tracking-widest uppercase">ВСЕГО ПРОСМОТРОВ</span>
              <strong className="block font-mono text-4xl sm:text-6xl font-extrabold text-neutral-300 tracking-tight">1.8M</strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1c1c1c] py-8 max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
        <p>© 2025–2026 ONCDEV. Разработка <a href="./polisours/index.html" className="text-white underline">PoliSours</a> и <a href="https://vobi.bio.link/" target="_blank" className="text-white underline">Vobi</a>.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => switchView('wiki')} className="hover:text-white cursor-pointer">УСЛОВИЯ</button>
          <span>•</span>
          <button onClick={() => switchView('wiki')} className="hover:text-white cursor-pointer">ОФЕРТА</button>
          <span>•</span>
          <button onClick={() => switchView('wiki')} className="hover:text-white cursor-pointer">КОНФИДЕНЦИАЛЬНОСТЬ</button>
        </div>
      </footer>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a0a0a] border border-[#222222] text-white px-4 py-3 rounded shadow-2xl font-mono text-xs flex items-center gap-2">
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
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#222222] rounded shadow-2xl overflow-hidden z-10 font-mono text-xs"
            >
              <div className="flex items-center px-4 py-3.5 border-b border-[#1c1c1c] gap-3">
                <Search className="w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="SEARCH SYSTEM DIRECTORY..." 
                  className="w-full bg-transparent outline-none text-white placeholder-neutral-600 uppercase"
                  autoFocus
                />
                <kbd className="bg-[#1c1c1c] text-neutral-400 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
              </div>

              <div className="p-2 space-y-1 max-h-80 overflow-y-auto uppercase">
                <button onClick={() => { switchView('timer'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-white hover:text-black transition-colors rounded text-neutral-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>/01 TIMER TELEMETRY</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('vpn'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-white hover:text-black transition-colors rounded text-neutral-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    <span>/02 VLESS VPN SYSTEM</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('wiki'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-white hover:text-black transition-colors rounded text-neutral-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>/03 KNOWLEDGE WIKI</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('summary'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-white hover:text-black transition-colors rounded text-neutral-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-4 h-4" />
                    <span>/04 YOUTUBE METRICS</span>
                  </div>
                  <span className="text-[10px]">OPEN ↗</span>
                </button>
                <button onClick={() => { switchView('about'); setCmdOpen(false); }} className="w-full flex items-center justify-between p-3 hover:bg-white hover:text-black transition-colors rounded text-neutral-300 cursor-pointer">
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
