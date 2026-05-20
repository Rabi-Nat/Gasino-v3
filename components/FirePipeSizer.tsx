
import React, { useState } from 'react';
import { Activity, Ruler, Info, Calculator, CheckCircle2, HelpCircle } from 'lucide-react';
import { HazardInfoModal } from './HazardInfoModal';

const PIPE_SCHEDULE = [
  { size: '1"', maxSprinklers: 2, flowGPM: 25 },
  { size: '1 1/4"', maxSprinklers: 3, flowGPM: 45 },
  { size: '1 1/2"', maxSprinklers: 5, flowGPM: 70 },
  { size: '2"', maxSprinklers: 10, flowGPM: 120 },
  { size: '2 1/2"', maxSprinklers: 30, flowGPM: 200 },
  { size: '3"', maxSprinklers: 60, flowGPM: 350 },
  { size: '4"', maxSprinklers: 100, flowGPM: 600 },
  { size: '6"', maxSprinklers: 275, flowGPM: 1500 },
];

export const FirePipeSizer: React.FC = () => {
  const [method, setMethod] = useState<'sprinkler' | 'flow'>('sprinkler');
  const [inputVal, setInputVal] = useState('5');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const val = parseInt(inputVal) || 0;
  
  const result = method === 'sprinkler' 
    ? PIPE_SCHEDULE.find(p => p.maxSprinklers >= val) || PIPE_SCHEDULE[PIPE_SCHEDULE.length-1]
    : PIPE_SCHEDULE.find(p => p.flowGPM >= val) || PIPE_SCHEDULE[PIPE_SCHEDULE.length-1];

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      <HazardInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-rose-100 p-3 rounded-2xl">
            <Activity className="text-rose-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">سایزینگ لوله‌های اطفا حریق</h2>
            <p className="text-slate-400 text-xs font-bold mt-1">تخمین سایز لوله بر اساس متد Pipe Schedule یا دبی عبوری</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-400 uppercase mr-1">روش محاسبه</label>
               <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => { setMethod('sprinkler'); setInputVal('5'); }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${method === 'sprinkler' ? 'bg-white text-rose-600 shadow-sm border border-rose-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >تعداد اسپرینکلر</button>
                  <button 
                    onClick={() => { setMethod('flow'); setInputVal('100'); }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${method === 'flow' ? 'bg-white text-rose-600 shadow-sm border border-rose-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >دبی عبوری (GPM)</button>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase mr-1">
                {method === 'sprinkler' ? 'تعداد کل سری اسپرینکلرها' : 'حداکثر دبی عبوری (GPM)'}
              </label>
              <input 
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:border-rose-500 outline-none font-black text-lg ltr"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
               <h4 className="text-[10px] font-black text-slate-400 uppercase">پیش‌فرض‌های طراحی:</h4>
               <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                    استاندارد NFPA 13
                  </li>
                  <li className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                      خطر معمولی (Ordinary Hazard)
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </li>
               </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white flex-1 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="relative z-10">
                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest block mb-6">سایز پیشنهادی لوله</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-black font-mono tracking-tighter text-rose-50 shadow-rose-900/20">{result.size}</span>
                  <span className="text-2xl font-bold opacity-40 italic">Inch</span>
                </div>
              </div>

              <div className="relative z-10 pt-10 border-t border-white/10">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                   <span>ظرفیت پوشش طبق استاندارد:</span>
                   <span className="text-white font-mono uppercase bg-white/10 px-3 py-1 rounded-lg text-xs ltr">
                      {method === 'sprinkler' ? `${result.maxSprinklers} Heads` : `${result.flowGPM} GPM`}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 flex gap-4">
        <div className="bg-slate-200 p-2 rounded-xl h-fit">
          <Info className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h4 className="text-slate-900 font-black text-sm mb-1">نکته اجرایی</h4>
          <p className="text-slate-600/70 text-xs leading-relaxed font-bold">
            در سیستم‌های تر (Wet Systems)، قطر لوله‌های اصلی (Risers) نباید کمتر از ۴ اینچ در نظر گرفته شود، مگر در موارد خاص محاسباتی. همچنین لوله‌های انتهایی متصل به اسپرینکلر معمولاً ۱ اینچ انتخاب می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
};
