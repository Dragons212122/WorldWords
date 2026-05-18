import React from 'react';
import { Button } from '../components/ui/Button';
import { BrainCircuit, CheckCircle2, Zap, Bookmark } from 'lucide-react';

export const FlashcardsPage = ({ currentTopic, currentTopicWords, currentWordIndex, isFlipped, flashcardProgress, learnedCount, topicTotal, selectedTopic, setCurrentPage, startQuiz, setLearnedWords, setCurrentWordIndex, setIsFlipped, handleFlipCard, personalNotes, saveNote, handleNavigation, toggleBookmark, isBookmarked, markLearned, onStartTTS }) => {
  const currentWord = currentTopicWords[currentWordIndex] || {};

  return (
    <div className="bg-[#F8F9FF] min-h-screen py-10 md:py-24 px-4 md:px-6 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-black mb-3">{currentTopic.title}</div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">Flashcards Canvas</h1>
            <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">Sequential learning built around a single current index. Tap the card to reveal the Vietnamese answer and use the buttons to continue.</p>
          </div>
          <Button variant="white" className="border border-gray-200 w-full lg:w-auto" onClick={() => setCurrentPage('gallery_detail')}>
            Back to Topic
          </Button>
        </div>

        {!currentTopicWords.length ? (
          <div className="p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-white border border-gray-100 shadow-lg text-center">
            <p className="text-lg md:text-xl text-gray-500">No flashcards are available for this topic yet.</p>
          </div>
        ) : learnedCount >= topicTotal && topicTotal > 0 ? (
          <div className="bg-white border border-gray-100 rounded-[32px] md:rounded-[48px] shadow-2xl p-8 md:p-12 text-center space-y-6 md:space-y-8">
            <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Topic Complete!</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium">You have mastered all <span className="font-black text-[#006D5B]">{topicTotal} words</span> in this topic!</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center pt-4">
              <Button onClick={() => startQuiz(selectedTopic)} className="rounded-3xl px-8 py-4 text-base md:text-lg w-full sm:w-auto"><Zap className="w-5 h-5" /> Take the Quiz</Button>
              <Button variant="outline" onClick={() => setCurrentPage('dashboard')} className="rounded-3xl px-8 py-4 text-base md:text-lg w-full sm:w-auto">Back to Dashboard</Button>
              <Button variant="ghost" onClick={() => { setLearnedWords(prev => { const u = {...prev}; delete u[selectedTopic]; localStorage.setItem('ww_learned', JSON.stringify(u)); return u; }); setCurrentWordIndex(0); setIsFlipped(false); }} className="rounded-3xl px-8 py-4 text-base md:text-lg w-full sm:w-auto">Study Again</Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[32px] md:rounded-[48px] shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-bold">Progress</div>
                <div className="text-3xl md:text-4xl font-black text-[#006D5B] mt-2">{currentWordIndex + 1} / {currentTopicWords.length}</div>
                <div className="text-sm text-gray-400 mt-1">Mastered: <span className="font-bold text-emerald-600">{learnedCount}/{topicTotal}</span></div>
              </div>
              <div className="w-full lg:w-96 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="h-full bg-[#006D5B] transition-all" style={{ width: `${flashcardProgress}%` }} />
              </div>
            </div>

            <div className="relative w-full h-[400px] md:h-[520px] perspective-1000">
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div onClick={handleFlipCard} className="absolute inset-0 bg-white border border-gray-200 rounded-[24px] md:rounded-[40px] p-6 md:p-10 shadow-2xl backface-hidden flex flex-col justify-between cursor-pointer">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-black">Tap to reveal</div>
                    <div className="text-3xl md:text-5xl font-black text-gray-900 mt-6 md:mt-10">{currentWord.term || 'No word selected'}</div>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F8F2] text-[#04634D] text-xs md:text-sm font-bold">{currentWord.pos || 'Part of speech'}</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-base md:text-lg text-gray-500">{currentWord.def || 'Definition will appear here.'}</p>
                    <p className="text-xs md:text-sm text-gray-400 italic">Example: {currentWord.ex || 'Example sentence.'}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                    <span>Front Side</span>
                    <span className="font-bold">{isFlipped ? 'Back' : 'Front'}</span>
                  </div>
                </div>

                <div onClick={handleFlipCard} className="absolute inset-0 bg-[#006D5B] border border-[#0f5138] rounded-[24px] md:rounded-[40px] p-6 md:p-10 shadow-2xl backface-hidden rotate-y-180 text-white flex flex-col justify-between cursor-pointer">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-emerald-200 font-black">Answer Revealed</div>
                    <div className="text-3xl md:text-5xl font-black mt-6 md:mt-10">{currentWord.trans || 'Translation will appear here'}</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-base md:text-lg leading-relaxed">{currentWord.def || 'Definition will appear here.'}</p>
                    {currentWord.ex && <p className="text-xs md:text-sm italic opacity-80">Example: {currentWord.ex}</p>}
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm text-emerald-200">
                    <span>Back Side</span>
                    <span className="font-bold">{isFlipped ? 'Tap to hide' : 'Tap to reveal'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm w-full text-left transition-all focus-within:shadow-md focus-within:border-[#006D5B]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span><BrainCircuit className="w-4 h-4 inline mr-2 text-[#006D5B]" /> Personal Memory Note</span>
                {personalNotes[currentWord.term] && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>}
              </div>
              <textarea 
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-sm md:text-[15px] font-medium text-gray-700 outline-none focus:border-emerald-200 focus:bg-white resize-none h-24 transition-all"
                placeholder="Write your own mnemonics, hints, or associations to help remember this word..."
                value={personalNotes[currentWord.term] || ''}
                onChange={(e) => saveNote(currentWord.term, e.target.value)}
              />
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center md:justify-start">
                <Button variant="outline" onClick={() => handleNavigation('reset')} className="rounded-3xl w-full sm:w-auto">Reset</Button>
                <button
                  onClick={() => toggleBookmark(selectedTopic, currentWord)}
                  className={`px-5 py-3 rounded-3xl border font-bold flex items-center justify-center w-full sm:w-auto gap-2 text-sm transition-all ${ isBookmarked(selectedTopic, currentWord.term) ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-500' }`}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked(selectedTopic, currentWord.term) ? 'currentColor' : 'none'} />
                  {isBookmarked(selectedTopic, currentWord.term) ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center md:justify-end">
                <button
                  disabled={!isFlipped}
                  onClick={() => { markLearned(selectedTopic, currentWord.term); handleNavigation('next'); }}
                  title={!isFlipped ? 'Flip the card to see the answer first' : ''}
                  className={`px-6 py-3 rounded-3xl font-bold flex items-center justify-center w-full sm:w-auto gap-2 transition-all ${
                    isFlipped
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg hover:-translate-y-1'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" /> Got it
                </button>
                {currentWordIndex === currentTopicWords.length - 1 ? (
                  <Button onClick={() => setCurrentPage('dashboard')} className="rounded-3xl bg-[#006D5B] text-white hover:bg-[#005244] shadow-md border-0 w-full sm:w-auto">Finish Topic</Button>
                ) : (
                  <Button onClick={() => handleNavigation('next')} className="rounded-3xl w-full sm:w-auto">Next</Button>
                )}
                <Button variant="white" className="rounded-3xl w-full sm:w-auto" onClick={() => onStartTTS(currentWord.term)}>Listen</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
