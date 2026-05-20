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
  Ruler,
  Home
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
    const mainMenuItems = [
      {
        id: 'gas',
        title: 'سیستم گازرسانی',
        englishTitle: 'Natural Gas Engineering',
        icon: Flame,
        colorClass: 'text-blue-600',
        bgClass: 'bg-gradient-to-r from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15',
        borderClass: 'border-blue-100 hover:border-blue-300',
        badge: 'مبحث ۱۷',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50',
        action: () => {
          setActiveSection('gas');
          setActiveTab('pipe');
          setHasSelectedSection(true);
        },
        description: 'امکانات سایزینگ لوله‌کشی، انتخاب کنتور متناسب، تعیین مشخصات دودکش و فواصل استاندارد شیرآلات گاز.',
        glowColor: 'rgba(37,99,235,0.06)',
        watermarkText: 'METHANE CH4'
      },
      {
        id: 'fire',
        title: 'سیستم آتش‌نشانی و ضدحریق',
        englishTitle: 'Hydraulic Fire Safety',
        icon: FireExtinguisher,
        colorClass: 'text-rose-600',
        bgClass: 'bg-gradient-to-r from-rose-500/5 to-rose-500/10 hover:from-rose-500/10 hover:to-rose-500/15',
        borderClass: 'border-rose-100 hover:border-rose-300',
        badge: 'نازل و اطفاء',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/50',
        action: () => {
          setActiveSection('fire');
          setActiveTab('water');
          setHasSelectedSection(true);
        },
        description: 'محاسبه حجم مخزن ذخیره سازی آب اطفاء، محاسبات هد پمپ، سایزینگ کلکتور و زون‌بندی تخصصی حریق.',
        glowColor: 'rgba(225,29,72,0.06)',
        watermarkText: 'HYDRAULIC'
      },
      {
        id: 'store',
        title: 'فروشگاه تدارکات ملزومات',
        englishTitle: 'Engineering Hardware Store',
        icon: StoreIcon,
        colorClass: 'text-emerald-600',
        bgClass: 'bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 hover:from-emerald-500/10 hover:to-emerald-500/15',
        borderClass: 'border-emerald-100 hover:border-emerald-300',
        badge: 'تجهیزات تأییدشده',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        action: () => {
          setActiveSection('gas');
          setActiveTab('store');
          setHasSelectedSection(true);
        },
        description: 'کاتالوگ و لیست استعلام قیمت انواع لوله‌های مانسمان بدون درز، اتصالات استاندارد و تجهیزات برقی ایمنی گاز.',
        glowColor: 'rgba(16,185,129,0.06)',
        watermarkText: 'STORE FITTINGS'
      },
      {
        id: 'contact',
        title: 'ارتباط مستقیم و پشتیبانی فنی',
        englishTitle: 'Consultation & Support',
        icon: MessageSquare,
        colorClass: 'text-violet-600',
        bgClass: 'bg-gradient-to-r from-violet-500/5 to-violet-500/10 hover:from-violet-500/10 hover:to-violet-500/15',
        borderClass: 'border-violet-100 hover:border-violet-300',
        badge: 'مشاوره آنلاین',
        badgeColor: 'bg-violet-50 text-violet-700 border-violet-200/50',
        action: () => {
          setActiveSection('gas');
          setActiveTab('contact');
          setHasSelectedSection(true);
        },
        description: 'طرح سوالات نظارت، استعلام نقشه‌ها و همکاری مستقیم با مهندسین.',
        glowColor: 'rgba(139,92,246,0.06)',
        watermarkText: 'CONSULT'
      },
      {
        id: 'hvac_placeholder',
        title: 'تاسیسات مکانیکی و سرمایش گرمایش',
        englishTitle: 'Mechanical HVAC Systems',
        icon: Wind,
        colorClass: 'text-amber-500/60',
        bgClass: 'bg-slate-50/50 cursor-not-allowed opacity-75',
        borderClass: 'border-slate-200/40',
        badge: 'بزودی',
        badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/50',
        action: () => {},
        description: 'محاسبه بارهای برودتی و حرارتی، سایزینگ کانال‌کشی هوا، چیلرها و فن‌کویل‌ها بر اساس دیتای سایکرومتریک شهرهای ایران.',
        glowColor: 'rgba(245,158,11,0.02)',
        watermarkText: 'COMING SOON HVAC'
      },
      {
        id: 'plumbing_placeholder',
        title: 'تاسیسات بهداشتی، آبرسانی و فاضلاب',
        englishTitle: 'Water & Plumbing Systems',
        icon: Cylinder,
        colorClass: 'text-cyan-500/60',
        bgClass: 'bg-slate-50/50 cursor-not-allowed opacity-75',
        borderClass: 'border-slate-200/40',
        badge: 'بزودی',
        badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200/50',
        action: () => {},
        description: 'محاسبات دبی خطوط آبرسانی، کلکتور فاضلاب ساختمان، و سایزینگ شیب لوله‌های ثقلی دفع آب‌های سطحی.',
        glowColor: 'rgba(6,182,212,0.02)',
        watermarkText: 'COMING SOON WATER'
      }
    ];

    // Parent container animation variants for staggered children load
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.05
        }
      }
    };

    const itemVariants = {
      hidden: { y: 25, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 180, damping: 20 } }
    };

    return (
      <div className="h-screen w-full bg-[#f8fafc] flex flex-col items-center py-10 px-4 md:py-16 relative font-sans overflow-y-auto">
        
        {/* Fine engineering background grid decor */}
        <div className="absolute inset-0 bg-[size:32px_32px] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] opacity-[0.2] pointer-events-none" />
        
        {/* Soft abstract blur accents */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

        {/* Animated Brand Header */}
        <div className="text-center mb-10 md:mb-12 relative z-10" dir="rtl">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            whileHover={{ scale: 1.08 }}
            className="cursor-default relative inline-block px-10 py-4"
          >
            {/* Ambient colorful backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-rose-500/10 rounded-full blur-2xl filter opacity-75 scale-90 animate-pulse pointer-events-none" />
            
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight bg-gradient-to-r from-blue-600 via-emerald-600 to-rose-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(37,99,235,0.08)] select-none">
              Gasino
            </h1>
          </motion.div>
        </div>

        {/* Constrained Visually-focused Vertical Stack Menu list */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-xl flex flex-col gap-4 relative z-10" 
          dir="rtl"
        >
          {mainMenuItems.map((menuItem) => {
            const IconComp = menuItem.icon;
            const isPlaceholder = menuItem.id.endsWith('_placeholder');
            
            return (
              <motion.div
                key={menuItem.id}
                variants={itemVariants}
                style={{ backgroundColor: menuItem.glowColor }}
                onClick={menuItem.action}
                className={`group relative overflow-hidden p-5 md:p-6 rounded-[28px] border ${menuItem.borderClass} ${menuItem.bgClass} cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-4`}
              >
                {/* Large Subtle Icon Watermark in the background corner */}
                <div className="absolute left-[-16px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 pointer-events-none rotate-[-15deg]">
                  <IconComp className="w-32 h-32 text-current" />
                </div>

                {/* English Watermark Text */}
                <div className="absolute left-4 top-2 text-[8px] font-black tracking-widest text-[#94a3b8]/15 font-mono select-none pointer-events-none hidden md:block">
                  {menuItem.watermarkText}
                </div>

                {/* Left Side Content - Standard Meta & Chevron */}
                <div className="flex flex-col items-start text-right z-10 flex-1 pl-2">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className={`text-base font-black ${isPlaceholder ? 'text-slate-500' : 'text-slate-800 group-hover:text-slate-950'} transition-colors`}>
                      {menuItem.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${menuItem.badgeColor}`}>
                      {menuItem.badge}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-[11px] leading-relaxed font-bold max-w-md">
                    {menuItem.description}
                  </p>
                  
                  <span className="text-[9px] text-slate-350 font-black mt-1.5 tracking-wide uppercase font-mono block">
                    {menuItem.englishTitle}
                  </span>
                </div>

                {/* Right Side Rounded Icon Box */}
                <div className="shrink-0 z-10 flex flex-col items-center gap-2">
                  <motion.div 
                    whileHover={isPlaceholder ? {} : { scale: 1.1, rotate: 5 }}
                    whileTap={isPlaceholder ? {} : { scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isPlaceholder ? 'bg-slate-100 text-slate-400/50' : 'bg-white text-current shadow-sm border border-slate-200/50 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:shadow-md'}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </motion.div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer info text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.7 }}
          className="mt-14 text-[9px] font-bold text-slate-400 tracking-wider text-center ltr"
        >
          GASINO ENGINEERING PORTAL • VERSION 5.5 • SECURE DESIGN
        </motion.div>
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
                {activeSection === 'gas' ? 'سیستم گازرسانی' : 'مهندسی ضد حریق'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-1 bg-slate-100 rounded-2xl flex mb-4 relative overflow-hidden">
          <motion.div 
            animate={{ x: activeSection === 'gas' ? '0%' : '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] rounded-xl shadow-sm ${activeSection === 'gas' ? 'bg-blue-600' : 'bg-rose-600'}`}
          />
          <button 
            onClick={() => { setActiveSection('gas'); setActiveTab('pipe'); }}
            className={`flex-1 py-2.5 text-[11px] font-black z-10 transition-colors ${activeSection === 'gas' ? 'text-white' : 'text-slate-400'}`}
          >
            سیستم گازرسانی
          </button>
          <button 
            onClick={() => { setActiveSection('fire'); setActiveTab('water'); }}
            className={`flex-1 py-2.5 text-[11px] font-black z-10 transition-colors ${activeSection === 'fire' ? 'text-white' : 'text-slate-400'}`}
          >
            آتش‌نشانی
          </button>
        </div>

        {/* Back to Home / Main Menu button */}
        <button 
          onClick={resetToLanding}
          className="flex items-center justify-center gap-2 mb-4 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-2xl text-[11px] font-black transition-all cursor-pointer shadow-sm w-full"
          dir="rtl"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>بازگشت به منوی اصلی</span>
        </button>
        
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
      <header className={`md:hidden h-16 border-b flex items-center justify-between px-4 sticky top-0 z-40 no-print transition-colors ${activeSection === 'gas' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
        <button 
          onClick={resetToLanding}
          className="bg-white/15 p-2.5 rounded-xl hover:bg-white/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title="بازگشت به منوی اصلی"
          dir="rtl"
        >
          <Home className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2 text-center overflow-hidden">
          <span className="font-black text-base truncate">{activeLabel}</span>
        </div>

        <button 
          onClick={toggleSection}
          className="bg-white/15 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{activeSection === 'gas' ? 'آتش‌نشانی' : 'گازرسانی'}</span>
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
