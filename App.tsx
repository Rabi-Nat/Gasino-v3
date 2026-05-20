import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Wind, 
  Gauge, 
  ShieldCheck, 
  MessageSquare,
  ChevronLeft,
  Store as StoreIcon,
  FlaskConical,
  Activity,
  ArrowLeftRight,
  FireExtinguisher,
  Cylinder,
  ArrowUpToLine,
  Wrench,
  Scaling,
  Ruler
} from 'lucide-react';
import { PipeCalculator } from './components/PipeCalculator';
import { Ventilation } from './components/Ventilation';
import { MeterSpecs } from './components/MeterSpecs';
import { ValveInstallation } from './components/ValveInstallation';
import { ApplianceDistance } from './components/ApplianceDistance';
import { PriceList } from './components/PriceList';
import { ContactUs } from './components/ContactUs';
import { Store } from './components/Store';
import { GasTest } from './components/GasTest';

// Firefighting Components
import { WaterSystem } from './components/WaterSystem';
import { FirePipeSizer } from './components/FirePipeSizer';
import { ExtinguisherCalc } from './components/ExtinguisherCalc';
import { FirePumpHead } from './components/FirePumpHead';

type SectionId = 'gas' | 'fire';
type TabId = 'pipe' | 'ventilation' | 'meter' | 'valve' | 'safety' | 'price' | 'contact' | 'store' | 'test' | 'water' | 'firepipe' | 'extinguisher' | 'pump';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('gas');
  const [hasSelectedSection, setHasSelectedSection] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('pipe');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const gasTabs = [
    { id: 'pipe' as TabId, label: 'سایزینگ لوله‌کشی', icon: Ruler, component: PipeCalculator },
    { id: 'ventilation' as TabId, label: 'تهویه و دریچه', icon: Wind, component: Ventilation },
    { id: 'meter' as TabId, label: 'کنتور', icon: Gauge, component: MeterSpecs },
    { id: 'valve' as TabId, label: 'فواصل شیرآلات', icon: Wrench, component: ValveInstallation },
    { id: 'safety' as TabId, label: 'فواصل ایمنی', icon: ShieldCheck, component: ApplianceDistance },
    { id: 'store' as TabId, label: 'فروشگاه ملزومات', icon: StoreIcon, component: Store },
    { id: 'test' as TabId, label: 'تست استقامت', icon: FlaskConical, component: GasTest },
    { id: 'contact' as TabId, label: 'تماس با ما', icon: MessageSquare, component: ContactUs },
  ];

  const fireTabs = [
    { id: 'water' as TabId, label: 'مخزن و دبی', icon: Cylinder, component: WaterSystem },
    { id: 'firepipe' as TabId, label: 'سایزینگ لوله', icon: Ruler, component: FirePipeSizer },
    { id: 'pump' as TabId, label: 'هد پمپ', icon: ArrowUpToLine, component: FirePumpHead },
    { id: 'extinguisher' as TabId, label: 'کپسول اطفاء', icon: FireExtinguisher, component: ExtinguisherCalc },
    { id: 'contact' as TabId, label: 'تماس با ما', icon: MessageSquare, component: ContactUs },
  ];

  const tabs = activeSection === 'gas' ? gasTabs : fireTabs;

  const handleSectionSelect = (section: SectionId) => {
    setActiveSection(section);
    setActiveTab(section === 'gas' ? 'pipe' : 'water');
    setHasSelectedSection(true);
  };

  const toggleSection = () => {
    const next = activeSection === 'gas' ? 'fire' : 'gas';
    setActiveSection(next);
    setActiveTab(next === 'gas' ? 'pipe' : 'water');
  };

  const resetToLanding = () => setHasSelectedSection(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

  // Infinite Auto-scroll logic
  useEffect(() => {
    let animationFrame: number;
    const scrollSpeed = 0.2; // Pixels per frame

    const animate = () => {
      if (!scrollRef.current || isInteracting) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const el = scrollRef.current;
      el.scrollLeft -= scrollSpeed; // Scroll left-to-right (negative scrollLeft in RTL)

      // Loop logic for RTL
      // In RTL, scrollLeft 0 is far right. Negative values move left.
      // We want to loop back when we've scrolled one full set.
      if (Math.abs(el.scrollLeft) >= (el.scrollWidth / 2)) {
        el.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInteracting]);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  };

  const handleInteractionEnd = () => {
    // Resume auto-scroll after 3 seconds of inactivity
    interactionTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || PipeCalculator;
  const activeLabel = tabs.find(t => t.id === activeTab)?.label || '';

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-blue-600 flex flex-col items-center justify-center transition-opacity duration-700">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl animate-bounce mb-6">
          <Flame className="text-blue-600 w-16 h-16" />
        </div>
        <h1 className="text-white text-4xl font-black mb-2">Gasino</h1>
        <div className="mt-12">
          <div className="w-32 h-1 bg-blue-400/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white" style={{ animation: 'loading-bar 1.5s ease-in-out infinite' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSelectedSection) {
    return (
      <div className="h-screen w-full bg-[#030712] flex flex-col md:flex-row overflow-hidden relative font-sans select-none">
        {/* GAS SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handleSectionSelect('gas')}
          className="flex-1 group relative cursor-pointer overflow-hidden border-b md:border-b-0 md:border-l border-white/5"
        >
          {/* Background Image / Pattern */}
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/20 transition-colors duration-700" />
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 bg-[size:32px_32px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [10, 5, 10]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="mb-8 p-6 rounded-[28px] bg-blue-600 shadow-[0_0_50px_-12px_rgba(37,99,235,0.5)]"
            >
              <Flame className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">طراحی گاز</h2>
            <p className="text-blue-200/40 font-bold text-sm md:text-lg max-w-xs mb-10 leading-relaxed uppercase tracking-widest">
              Natural Gas Engineering System
            </p>
            <div className="px-8 py-3.5 rounded-full border border-white/10 text-white/40 group-hover:border-blue-500 group-hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all">
              Start Project
            </div>
          </div>

          <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-20 text-[200px] font-black text-white/[0.02] rotate-90 pointer-events-none ltr">
            METHANE
          </div>
        </motion.div>

        {/* FIRE SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleSectionSelect('fire')}
          className="flex-1 group relative cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-rose-600/5 group-hover:bg-rose-600/20 transition-colors duration-700" />
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 bg-[size:32px_32px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [-10, -5, -10]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="mb-8 p-6 rounded-[28px] bg-rose-600 shadow-[0_0_50px_-12px_rgba(225,29,72,0.5)]"
            >
              <FireExtinguisher className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">آتش نشانی</h2>
            <p className="text-rose-200/40 font-bold text-sm md:text-lg max-w-xs mb-10 leading-relaxed uppercase tracking-widest">
              Hydraulic Fire Protection
            </p>
            <div className="px-8 py-3.5 rounded-full border border-white/10 text-white/40 group-hover:border-rose-500 group-hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all">
              Safety Panel
            </div>
          </div>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 -mr-20 text-[200px] font-black text-white/[0.02] -rotate-90 pointer-events-none ltr">
            HYDRAULIC
          </div>
        </motion.div>

        {/* Center Logo Floating */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-50 pointer-events-none">
           <div className="bg-white p-5 rounded-[32px] shadow-2xl">
              <div className="w-4 h-4 bg-slate-900 rounded-full" />
           </div>
        </div>
      </div>
    );
  }



  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden text-slate-900 bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-l border-slate-200 p-6 z-50 no-print">
        <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={resetToLanding}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl shadow-lg transition-all group-hover:scale-110 ${activeSection === 'gas' ? 'bg-blue-600 shadow-blue-100' : 'bg-rose-600 shadow-rose-100'}`}>
              <Flame className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-xl leading-tight">Gasino</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                {activeSection === 'gas' ? 'طراحی گاز' : 'مهندسی ضد حریق'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-1 bg-slate-100 rounded-2xl flex mb-6 relative overflow-hidden">
          <motion.div 
            animate={{ x: activeSection === 'gas' ? '0%' : '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] rounded-xl shadow-sm ${activeSection === 'gas' ? 'bg-blue-600' : 'bg-rose-600'}`}
          />
          <button 
            onClick={() => { setActiveSection('gas'); setActiveTab('pipe'); }}
            className={`flex-1 py-2.5 text-[11px] font-black z-10 transition-colors ${activeSection === 'gas' ? 'text-white' : 'text-slate-400'}`}
          >
            طراحی گاز
          </button>
          <button 
            onClick={() => { setActiveSection('fire'); setActiveTab('water'); }}
            className={`flex-1 py-2.5 text-[11px] font-black z-10 transition-colors ${activeSection === 'fire' ? 'text-white' : 'text-slate-400'}`}
          >
            آتش‌نشانی
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                sidebar-btn flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${activeTab === tab.id 
                  ? (activeSection === 'gas' ? 'active-gas' : 'active-fire') 
                  : 'text-slate-500 hover:bg-slate-50'}
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 font-sans">
            <p className="text-[10px] text-blue-700 font-black leading-relaxed">ویرایش پنجم ۱۴۰۳</p>
            <p className="text-[9px] text-blue-400 mt-0.5 uppercase font-bold tracking-tighter ltr">National Building Regulations</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className={`md:hidden h-16 border-b flex items-center justify-between px-5 sticky top-0 z-40 no-print transition-colors ${activeSection === 'gas' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg">{activeLabel}</span>
        </div>
        <button 
          onClick={toggleSection}
          className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeftRight className="w-3 h-3" />
          {activeSection === 'gas' ? 'بخش آتش‌نشانی' : 'بخش طراحی گاز'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full custom-scrollbar p-4 md:p-10 pb-28 md:pb-10 overflow-y-auto">
          <ActiveComponent />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 z-40 no-print"
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onMouseDown={handleInteractionStart}
          onMouseUp={handleInteractionEnd}
        >
          <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto no-scrollbar gap-1 px-2"
            style={{ direction: 'rtl' }}
          >
            {/* Double the tabs for infinite loop effect */}
            {[...tabs, ...tabs].map((tab, idx) => (
              <button
                key={`${tab.id}-${idx}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center min-w-[80px] py-1 transition-all duration-300 relative
                  ${activeTab === tab.id 
                    ? (activeSection === 'gas' ? 'text-blue-600' : 'text-rose-600') 
                    : 'text-slate-400'}
                `}
              >
                {activeTab === tab.id && idx < tabs.length && (
                  <motion.div 
                    layoutId="activeTabMobile"
                    className={`absolute top-[-8px] w-5 h-1 rounded-full ${activeSection === 'gas' ? 'bg-blue-600' : 'bg-rose-600'}`} 
                  />
                )}
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold">
                  {tab.id === 'valve' ? 'شیر' : tab.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
};

export default App;
