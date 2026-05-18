import React from 'react';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage = ({ onAction, user }) => (
  <div className="bg-white min-h-screen">
    <section className="pt-20 pb-40 px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-16 max-w-8xl mx-auto">
      <div className="flex-1 space-y-10 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-[#006D5B] rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
           <Zap className="w-3 h-3 fill-current" /> Focus on IELTS Academic
        </div>
        <h1 className="text-[96px] font-black text-gray-900 leading-[0.9] tracking-tighter">Master English, <br /><span className="text-[#006D5B] italic">One Word</span> at a Time</h1>
        <p className="text-2xl text-gray-400 max-w-xl font-medium leading-relaxed italic">The most advanced vocabulary system for university-level research and high-band IELTS candidates.</p>
        <div className="flex gap-6">
          <Button onClick={() => onAction('catalog')} className="px-12 py-5 text-xl rounded-2xl shadow-2xl shadow-emerald-200">Explore Gallery <ArrowRight className="w-5 h-5" /></Button>
          <Button variant="outline" className="px-12 py-5 text-xl rounded-2xl">See Examples</Button>
        </div>
      </div>
      <div className="flex-1 relative group perspective-1000">
         <div className="relative rounded-[56px] overflow-hidden border-[20px] border-white shadow-2xl h-[600px] w-full max-w-2xl transform lg:rotate-2 group-hover:rotate-0 transition-all duration-1000 ease-out group-hover:scale-[1.02]">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Students learning IELTS vocabulary together and succeeding" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-[#006D5B]/5 group-hover:bg-transparent transition-colors duration-1000"></div>
         </div>
         <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-4 animate-bounce duration-[3000ms] hover:animate-none hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-14 h-14 bg-emerald-50 text-[#006D5B] rounded-full flex items-center justify-center"><TrendingUp className="w-8 h-8" /></div>
            <div>
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Growth Rate</p>
               <p className="text-3xl font-black text-gray-900">150% Weekly! Amazing!</p>
            </div>
         </div>
      </div>
    </section>
  </div>
);
