import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { TOPICS } from '../data/topics';

export const CatalogPage = ({ setCurrentPage, selectTopic }) => (
  <div className="bg-[#F8F9FF] min-h-screen py-12 md:py-24 px-6 md:px-12 lg:px-20 space-y-8 md:space-y-16 animate-in slide-in-from-bottom duration-700">
    <div className="max-w-7xl mx-auto space-y-4 text-left">
      <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">Flashcards</h1>
      <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed max-w-2xl italic">Choose a topic and start learning with interactive flashcards. Each collection is designed to optimize your vocabulary growth.</p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
      {TOPICS.map((topic) => (
        <Container key={topic.id} className="p-0 overflow-hidden flex flex-col group hover:-translate-y-4 transition-all duration-500 ease-out border-none shadow-xl hover:shadow-2xl" onClick={() => selectTopic(topic.id)}>
          <div className="h-48 md:h-64 relative overflow-hidden">
            <img 
              src={topic.img} 
              alt={topic.title} 
              className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#00E5BC] text-white text-[10px] font-black uppercase rounded-full shadow-lg tracking-widest transform transition-transform duration-500 group-hover:scale-110">
              {topic.words}
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col flex-1 space-y-4 md:space-y-6">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-[#006D5B] transition-colors">{topic.title}</h3>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed flex-1 opacity-70">"{topic.desc}"</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 md:pt-8 border-t border-gray-50 gap-4 sm:gap-0">
              <div className="flex gap-2">
                 {topic.levels.map(l => <span key={l} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-50 text-[10px] md:text-[11px] font-black text-gray-400 border border-gray-100`}>{l}</span>)}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setCurrentPage('flashcards'); }} className="flex items-center gap-2 text-[#006D5B] font-black text-xs md:text-sm hover:gap-4 transition-all uppercase tracking-widest w-full sm:w-auto justify-between sm:justify-end">Start Flashcards <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>
          </div>
        </Container>
      ))}
    </div>
  </div>
);
