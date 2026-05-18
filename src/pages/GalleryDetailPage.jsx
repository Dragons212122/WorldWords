import React from 'react';
import { ChevronDown, CheckCircle2, PlayCircle, Zap, Volume2, Bookmark } from 'lucide-react';

export const GalleryDetailPage = ({ selectedTopic, TOPICS, WORDS_BY_TOPIC, setCurrentPage, learnedCount, topicTotal, topicProgress, startQuiz, onStartTTS, toggleBookmark, isBookmarked, learnedWords }) => {
  const topic = TOPICS.find(t => t.id === selectedTopic);

  return (
    <div className="bg-[#F8F9FF] min-h-screen py-12 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
         {/* Breadcrumbs */}
         <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <button onClick={() => setCurrentPage('catalog')} className="hover:text-gray-900 transition-colors">Topics</button>
            <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
            <span className="text-gray-900 font-bold">{topic?.title}</span>
         </div>
         
         {/* Header & Progress */}
         <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1 space-y-3">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">{topic?.title}</h1>
              <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">{topic?.desc}</p>
            </div>
            <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-gray-600 uppercase tracking-widest text-xs">Topic Progress</h4>
                   <span className="text-sm font-black text-[#006D5B]">{learnedCount}/{topicTotal} words ({topicProgress}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-[#006D5B] transition-all duration-1000" style={{width:`${topicProgress}%`}} />
                </div>
                {topicProgress === 100 && (
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl mb-3"><CheckCircle2 className="w-4 h-4" /> Topic Completed! 🎉</div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#006D5B] cursor-pointer hover:underline" onClick={() => setCurrentPage('flashcards')}>
                     <PlayCircle className="w-5 h-5" /> Start Learning
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-600 cursor-pointer hover:underline" onClick={() => startQuiz(selectedTopic)}>
                     <Zap className="w-5 h-5" /> Quick Quiz (6 questions)
                  </div>
                </div>
             </div>
         </div>

         {/* Hero Section */}
         <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 h-64 lg:h-80 rounded-3xl overflow-hidden relative shadow-sm">
               <img src={topic?.img} alt={topic?.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                 <span className="px-3 py-1.5 bg-[#006D5B] text-white rounded-full text-[10px] font-black uppercase tracking-widest w-max mb-3 shadow-sm">Study Field</span>
                 <h3 className="text-2xl lg:text-3xl font-black">{topic?.title}</h3>
               </div>
            </div>
            <div className="w-full lg:w-1/3 h-64 lg:h-80 bg-[#006D5B] rounded-3xl p-8 text-white shadow-sm flex flex-col justify-center relative overflow-hidden">
               <Zap className="w-8 h-8 mb-4 text-emerald-300" />
               <h4 className="text-xl font-black mb-3">Precision over Prolixity</h4>
               <p className="text-emerald-50 text-sm leading-relaxed opacity-90">In academic discourse, clarity is paramount. Every word must serve a specific diagnostic or analytical purpose to ensure replicability and peer understanding.</p>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
            </div>
         </div>

         {/* Word Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(WORDS_BY_TOPIC[selectedTopic] || []).map((w, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 group">
                 <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 group-hover:bg-blue-100">{w.pos}</span>
                    <button onClick={() => onStartTTS(w.term)} className="text-gray-400 hover:text-[#006D5B] hover:scale-110 hover:bg-emerald-50 p-2 rounded-full transition-all"><Volume2 className="w-5 h-5" /></button>
                 </div>
                 
                 <div className="space-y-3 mb-8 flex-1">
                    <h3 className="text-2xl font-black text-[#006D5B] tracking-tight">{w.term}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed text-sm">{w.def}</p>
                    <div className="pt-4 mt-4 border-t border-gray-50">
                       <p className="text-sm text-gray-500 italic">"{w.ex}"</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3 mt-auto">
                    <button onClick={() => setCurrentPage('flashcards')} className="flex-1 py-3 bg-gray-50 text-gray-600 font-bold hover:bg-emerald-50 hover:text-[#006D5B] transition-colors rounded-xl text-xs uppercase tracking-widest">
                       Details
                    </button>
                    <button onClick={() => toggleBookmark(selectedTopic, w)} className={`p-3 border rounded-xl transition-colors ${ isBookmarked(selectedTopic, w.term) ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-[#006D5B]' }`}>
                       <Bookmark className="w-5 h-5" fill={isBookmarked(selectedTopic, w.term) ? 'currentColor' : 'none'} />
                    </button>
                    {(learnedWords[selectedTopic] || []).includes(w.term) && (
                      <div className="p-3 text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
