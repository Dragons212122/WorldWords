import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, Search, User, Loader2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Data & Services
import { TOPICS, WORDS_BY_TOPIC } from './data/topics';
import { callGeminiTTS, pcmToWav } from './services/gemini';

// Pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { CatalogPage } from './pages/CatalogPage';
import { GalleryDetailPage } from './pages/GalleryDetailPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuizPage } from './pages/QuizPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash.split('?')[0] || 'home';
  });
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const hash = window.location.hash;
    const query = hash.split('?')[1];
    if (query) {
      const params = new URLSearchParams(query);
      return params.get('topic');
    }
    return null;
  });
  const [currentTopicWords, setCurrentTopicWords] = useState(() => {
    const hash = window.location.hash;
    const query = hash.split('?')[1];
    let topic = null;
    if (query) {
      const params = new URLSearchParams(query);
      topic = params.get('topic');
    }
    return topic && WORDS_BY_TOPIC[topic] ? WORDS_BY_TOPIC[topic] : (WORDS_BY_TOPIC['academic'] || []);
  });

  useEffect(() => {
    let newHash = currentPage === 'home' ? '' : `#/${currentPage}`;
    if (selectedTopic && (currentPage === 'gallery_detail' || currentPage === 'flashcards' || currentPage === 'quiz')) {
      newHash += `?topic=${selectedTopic}`;
    }
    
    const currentHash = window.location.hash;
    if (currentHash !== newHash) {
      window.history.pushState(null, '', newHash || window.location.pathname + window.location.search);
    }
  }, [currentPage, selectedTopic]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const [page, query] = hash.split('?');
      setCurrentPage(page || 'home');
      
      if (query) {
        const params = new URLSearchParams(query);
        const topic = params.get('topic');
        setSelectedTopic(topic);
        if (topic && WORDS_BY_TOPIC[topic]) {
          setCurrentTopicWords(WORDS_BY_TOPIC[topic]);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef(null);
  
  const [learnedWords, setLearnedWords] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ww_learned') || '{}'); } catch { return {}; }
  });
  
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ww_bookmarks') || '[]'); } catch { return []; }
  });
  
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('worldwords_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.uid && userData.email && userData.name) {
          setUser({ isAnonymous: false, uid: userData.uid, email: userData.email });
          setProfile(userData);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        localStorage.removeItem('worldwords_user');
      }
    }
    
    setUser({ isAnonymous: true, uid: 'demo-user' });
    setProfile({ 
      name: "Scholar", 
      goal: "7.5", 
      streak: 1, 
      xp: 0, 
      rank: "New Scholar", 
      recentLessons: [], 
      createdAt: new Date().toISOString() 
    });
    setIsLoading(false);
  }, []);

  const onStartTTS = async (text) => {
    if (ttsLoading) return;
    setTtsLoading(true);
    const audio = await callGeminiTTS(text);
    if (audio && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(pcmToWav(audio.data));
      audioRef.current.play();
    }
    setTtsLoading(false);
  };

  const selectTopic = (topicId) => {
    const words = WORDS_BY_TOPIC[topicId] || [];
    setSelectedTopic(topicId);
    setCurrentTopicWords(words);
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setCurrentPage('gallery_detail');
    window.scrollTo(0, 0);
  };

  const handleNavigation = (direction) => {
    setCurrentWordIndex((prevIndex) => {
      const maxIndex = currentTopicWords.length - 1;
      if (direction === 'next') {
        return prevIndex < maxIndex ? prevIndex + 1 : prevIndex;
      }
      if (direction === 'reset') {
        return 0;
      }
      return prevIndex;
    });
    if (direction === 'next' || direction === 'reset') {
      setIsFlipped(false);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const [personalNotes, setPersonalNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ww_notes') || '{}'); } catch { return {}; }
  });

  const saveNote = (term, note) => {
    setPersonalNotes(prev => {
      const updated = { ...prev, [term]: note };
      localStorage.setItem('ww_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const markLearned = (topicId, term) => {
    setLearnedWords(prev => {
      const updated = { ...prev, [topicId]: [...(prev[topicId] || []), term].filter((v,i,a)=>a.indexOf(v)===i) };
      localStorage.setItem('ww_learned', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBookmark = (topicId, word) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.topicId === topicId && b.term === word.term);
      const updated = exists
        ? prev.filter(b => !(b.topicId === topicId && b.term === word.term))
        : [...prev, { topicId, ...word }];
      localStorage.setItem('ww_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (topicId, term) => bookmarks.some(b => b.topicId === topicId && b.term === term);

  const startQuiz = (topicId) => {
    const allWords = WORDS_BY_TOPIC[topicId] || [];
    const allOthers = Object.values(WORDS_BY_TOPIC).flat();
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(6, shuffled.length));
    const questions = picked.map(w => {
      const distractors = allOthers.filter(o => o.term !== w.term).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...distractors.map(d => d.trans), w.trans].sort(() => Math.random() - 0.5);
      return { word: w, options, correct: w.trans };
    });
    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizDone(false);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (score) => {
    // Add 10 XP per correct answer
    const gainedXP = score * 10;
    if (profile && gainedXP > 0) {
      const updatedProfile = { ...profile, xp: (profile.xp || 0) + gainedXP };
      setProfile(updatedProfile);
      localStorage.setItem('worldwords_user', JSON.stringify(updatedProfile));
    }
  };

  const currentTopic = TOPICS.find((topic) => topic.id === selectedTopic) || TOPICS[0];
  const flashcardProgress = currentTopicWords.length ? Math.round(((currentWordIndex + 1) / currentTopicWords.length) * 100) : 0;
  const learnedCount = (learnedWords[selectedTopic] || []).length;
  const topicTotal = currentTopicWords.length;
  const topicProgress = topicTotal ? Math.round((learnedCount / topicTotal) * 100) : 0;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#006D5B] w-12 h-12 mb-4" />
      <p className="font-bold text-gray-500 uppercase tracking-[0.2em] text-[10px]">Clarity in Education</p>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': 
        return <HomePage onAction={setCurrentPage} user={user} />;
      case 'catalog': 
        return <CatalogPage setCurrentPage={setCurrentPage} selectTopic={selectTopic} />;
      case 'gallery_detail':
        return <GalleryDetailPage 
          selectedTopic={selectedTopic} TOPICS={TOPICS} WORDS_BY_TOPIC={WORDS_BY_TOPIC} 
          setCurrentPage={setCurrentPage} learnedCount={learnedCount} topicTotal={topicTotal} 
          topicProgress={topicProgress} startQuiz={startQuiz} onStartTTS={onStartTTS} 
          toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} learnedWords={learnedWords} 
        />;
      case 'auth': 
        return <AuthPage mode="signup" onToggleMode={() => setCurrentPage('login')} onAuthSuccess={() => setCurrentPage('dashboard')} />;
      case 'login': 
        return <AuthPage mode="login" onToggleMode={() => setCurrentPage('auth')} onAuthSuccess={() => setCurrentPage('dashboard')} />;
      case 'flashcards': 
        return <FlashcardsPage 
          currentTopic={currentTopic} currentTopicWords={currentTopicWords} currentWordIndex={currentWordIndex} 
          isFlipped={isFlipped} flashcardProgress={flashcardProgress} learnedCount={learnedCount} 
          topicTotal={topicTotal} selectedTopic={selectedTopic} setCurrentPage={setCurrentPage} 
          startQuiz={startQuiz} setLearnedWords={setLearnedWords} setCurrentWordIndex={setCurrentWordIndex} 
          setIsFlipped={setIsFlipped} handleFlipCard={handleFlipCard} personalNotes={personalNotes} 
          saveNote={saveNote} handleNavigation={handleNavigation} toggleBookmark={toggleBookmark} 
          isBookmarked={isBookmarked} markLearned={markLearned} onStartTTS={onStartTTS} 
        />;
      case 'quiz':
        return <QuizPage 
          quizQuestions={quizQuestions} quizIndex={quizIndex} quizSelected={quizSelected} 
          quizScore={quizScore} quizDone={quizDone} currentTopic={currentTopic} 
          setCurrentPage={setCurrentPage} startQuiz={startQuiz} selectedTopic={selectedTopic} 
          setQuizSelected={setQuizSelected} setQuizScore={setQuizScore} setQuizDone={setQuizDone} 
          setQuizIndex={setQuizIndex} onQuizComplete={handleQuizComplete}
        />;
      case 'dashboard': 
        return <DashboardPage 
          profile={profile} learnedWords={learnedWords} bookmarks={bookmarks} 
          selectTopic={selectTopic} setCurrentPage={setCurrentPage} 
        />;
      case 'profile': 
        return <ProfilePage 
          profile={profile} 
          onLogout={() => {
            localStorage.removeItem('worldwords_user');
            localStorage.clear();
            setUser({ isAnonymous: true, uid: 'demo-user' });
            setProfile({ name: "Scholar", goal: "7.5", streak: 1, xp: 0, rank: "New Scholar", recentLessons: [], createdAt: new Date().toISOString() });
            setCurrentPage('home');
            setSelectedTopic(null);
            setCurrentWordIndex(0);
            setIsFlipped(false);
          }}
          onGoHome={() => setCurrentPage('home')}
          onProfileUpdate={(updatedData) => {
            const updatedProfile = { ...profile, ...updatedData };
            setProfile(updatedProfile);
            localStorage.setItem('worldwords_user', JSON.stringify(updatedProfile));
          }}
        />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#006D5B] selection:text-white">
      <Analytics />
      <SpeedInsights />
      <audio ref={audioRef} className="hidden" />
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 border-b border-gray-50 py-6 px-12 lg:px-24 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
          <div className="bg-[#006D5B] text-white p-2 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-emerald-200"><BookOpen className="w-8 h-8" /></div>
          <span className="text-3xl font-black tracking-tighter uppercase text-gray-900">WORLDWORDS</span>
        </div>
        <div className="flex gap-8 font-black text-sm uppercase items-center text-gray-500 tracking-widest">
          <button onClick={() => setCurrentPage('home')} className={`hover:text-gray-900 transition-colors ${currentPage === 'home' ? 'text-gray-900' : ''}`}>Home</button>
          <button onClick={() => { if(user?.isAnonymous) setCurrentPage('auth'); else setCurrentPage('dashboard'); }} className={`hover:text-gray-900 transition-colors ${currentPage === 'dashboard' || currentPage === 'profile' ? 'text-gray-900' : ''}`}>Dashboard</button>
          <div className="relative group py-2 cursor-pointer">
            <button className={`flex items-center gap-1 hover:text-gray-900 transition-all relative ${currentPage === 'catalog' || currentPage === 'gallery_detail' || currentPage === 'flashcards' ? 'text-gray-900 after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#006D5B]' : ''}`}>
              Gallery <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,109,91,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden z-50 transform translate-y-2 group-hover:translate-y-0">
              <button onClick={() => setCurrentPage('catalog')} className="px-5 py-4 text-left hover:bg-emerald-50 text-gray-500 hover:text-[#006D5B] font-bold text-xs tracking-widest uppercase transition-colors">Flashcards</button>
            </div>
          </div>
          <div className="flex items-center gap-8 pl-8 border-l border-gray-100">
             <Search className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
             <div 
               onClick={() => user?.isAnonymous ? setCurrentPage('auth') : setCurrentPage('profile')}
               className={`w-12 h-12 flex items-center justify-center rounded-full border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform hover:shadow-2xl font-black ${
                 user?.isAnonymous 
                   ? 'bg-gray-100 text-gray-400' 
                   : 'bg-emerald-50 text-[#006D5B]'
               }`}
               title={user?.isAnonymous ? "Create Account" : "View Profile"}
             >
               {user?.isAnonymous ? (
                 <User className="w-6 h-6" />
               ) : (
                 profile?.name?.substring(0, 2).toUpperCase() || "JD"
               )}
             </div>
          </div>
        </div>
      </nav>
      <main className="pt-20">{renderPage()}</main>
      <footer className="mt-40 py-24 px-12 lg:px-24 border-t border-gray-50 bg-white flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
        <div className="flex flex-col gap-4 text-center md:text-left">
           <div className="flex items-center gap-3 justify-center md:justify-start font-black text-xl text-gray-900 tracking-tighter"><div className="bg-gray-100 p-1 rounded-md"><BookOpen className="w-5 h-5" /></div>WORLDWORDS</div>
           <p className="italic opacity-60">© 2026 WorldWords. Empowering academic learners globally.</p>
        </div>
        <div className="flex gap-12">
          <span className="cursor-pointer hover:text-gray-900">Privacy</span><span className="cursor-pointer hover:text-gray-900">Terms</span><span className="cursor-pointer hover:text-gray-900">Support</span>
        </div>
      </footer>
      <style>{`.perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); } .animate-shake { animation: shake 0.2s ease-in-out 0s 2; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`}</style>
    </div>
  );
}
