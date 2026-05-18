import React from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const QuizPage = ({ quizQuestions, quizIndex, quizSelected, quizScore, quizDone, currentTopic, setCurrentPage, startQuiz, selectedTopic, setQuizSelected, setQuizScore, setQuizDone, setQuizIndex, onQuizComplete }) => {
  const q = quizQuestions[quizIndex];

  return (
    <div className="bg-[#F8F9FF] min-h-screen py-24 px-6 lg:px-24">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentPage('gallery_detail')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold"><ArrowLeft className="w-4 h-4" /> Back</button>
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quiz • {currentTopic?.title}</span>
        </div>
        {quizDone ? (
          <div className="bg-white rounded-[48px] shadow-2xl p-12 text-center space-y-8">
            <div className="text-7xl">{quizScore >= 5 ? '🎉' : quizScore >= 3 ? '💪' : '📚'}</div>
            <h2 className="text-5xl font-black text-gray-900">Results!</h2>
            <p className="text-2xl font-bold text-[#006D5B]">{quizScore} / {quizQuestions.length} correct</p>
            <p className="text-gray-500">{quizScore === quizQuestions.length ? 'Perfect score! You know them all!' : quizScore >= 4 ? 'Great job! Keep it up!' : 'Keep practicing, you\'ll get there!'}</p>
            <p className="text-lg font-black text-orange-500 bg-orange-50 px-4 py-2 rounded-xl inline-block">+ {quizScore * 10} XP</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startQuiz(selectedTopic)} className="rounded-3xl"><Zap className="w-4 h-4" /> Try Again</Button>
              <Button variant="outline" onClick={() => setCurrentPage('gallery_detail')} className="rounded-3xl">Back to Topic</Button>
            </div>
          </div>
        ) : q ? (
          <div className="bg-white rounded-[48px] shadow-2xl p-10 space-y-8">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Question {quizIndex + 1} / {quizQuestions.length}</span>
              <div className="flex gap-1">{quizQuestions.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i < quizIndex ? 'bg-emerald-400' : i === quizIndex ? 'bg-[#006D5B]' : 'bg-gray-200'}`} />)}</div>
            </div>
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase">{q.word.pos}</span>
              <h2 className="text-5xl font-black text-gray-900 mt-4">{q.word.term}</h2>
              <p className="text-gray-500 font-medium">{q.word.def}</p>
            </div>
            <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Choose the correct Vietnamese meaning:</p>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => {
                let style = 'border-2 border-gray-100 bg-white text-gray-700 hover:border-[#006D5B] hover:bg-emerald-50';
                if (quizSelected !== null) {
                  if (opt === q.correct) style = 'border-2 border-emerald-400 bg-emerald-50 text-emerald-700 font-black';
                  else if (opt === quizSelected && opt !== q.correct) style = 'border-2 border-red-300 bg-red-50 text-red-600';
                  else style = 'border-2 border-gray-100 bg-gray-50 text-gray-400';
                }
                return (
                  <button key={i} disabled={quizSelected !== null}
                    onClick={() => {
                      setQuizSelected(opt);
                      let newScore = quizScore;
                      if (opt === q.correct) {
                        newScore = quizScore + 1;
                        setQuizScore(newScore);
                      }
                      setTimeout(() => {
                        if (quizIndex + 1 >= quizQuestions.length) {
                          setQuizDone(true);
                          if (onQuizComplete) {
                            onQuizComplete(newScore); // Award XP
                          }
                        }
                        else { 
                          setQuizIndex(qi => qi + 1); 
                          setQuizSelected(null); 
                        }
                      }, 1500);
                    }}
                    className={`w-full p-4 rounded-2xl text-left font-bold transition-all ${style}`}
                  >{opt}</button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
