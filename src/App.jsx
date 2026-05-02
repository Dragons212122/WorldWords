import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInAnonymously, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithCustomToken
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { 
  BookOpen, User, Search, Trophy, ArrowRight, CheckCircle2, BrainCircuit, TrendingUp,
  LogOut, GraduationCap, MessageSquare, Globe, Star, Zap, Filter, ArrowLeft, Volume2,
  Bookmark, Target, Flame, History, Mail, Lock, Sparkles, Users, Loader2, XCircle,
  ShieldCheck, UserPlus, Crown, Activity, Database, ChevronDown, PlayCircle
} from 'lucide-react';

// --- Cấu hình Firebase ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'world-words-default';

// --- Gemini API (Phát âm) ---
const apiKey = ""; 

async function callGeminiTTS(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        generationConfig: { 
          responseModalities: ["AUDIO"], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } 
        }
      })
    });
    const result = await response.json();
    return result.candidates[0].content.parts[0].inlineData;
  } catch (error) { return null; }
}

function pcmToWav(base64Data, sampleRate = 24000) {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const buffer = new ArrayBuffer(44 + len);
  const view = new DataView(buffer);
  const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
  writeString(0, 'RIFF'); view.setUint32(4, 36 + len, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data'); view.setUint32(40, len, true);
  for (let i = 0; i < len; i += 2) { const sample = (binaryString.charCodeAt(i) | (binaryString.charCodeAt(i + 1) << 8)); view.setInt16(44 + i, sample, true); }
  return new Blob([buffer], { type: 'audio/wav' });
}

// --- Dữ liệu Nội dung (IELTS Focused) ---
const TOPICS = [
  { id: 'academic', title: 'Academic Excellence', words: '45 WORDS', levels: ['A1', 'C1'], gradient: 'from-orange-200 via-stone-400 to-stone-600', desc: 'Master advanced vocabulary tailored for university-level research, essays, and scholarly presentations.' },
  { id: 'business', title: 'Business Communication', words: '32 WORDS', levels: ['B2'], gradient: 'from-orange-300 via-blue-400 to-blue-800', desc: 'Master professional terminology for negotiations, meetings, and project management.' },
  { id: 'daily', title: 'Daily Conversations', words: '60 WORDS', levels: ['A2'], gradient: 'from-emerald-800 via-stone-500 to-orange-400', desc: 'Common phrases and idioms to help you communicate naturally like a native speaker.' },
  { id: 'research', title: 'Research Methodology', words: '28 WORDS', levels: ['C1'], gradient: 'from-blue-200 via-emerald-400 to-stone-600', desc: 'Master the terminology of systematic investigation, data collection, and academic inquiry.' },
  { id: 'critical', title: 'Critical Analysis', words: '35 WORDS', levels: ['B2', 'C1'], gradient: 'from-stone-400 via-emerald-600 to-stone-800', desc: 'Essential vocabulary for evaluating complex arguments, identifying bias, and synthesizing diverse sources.' },
  { id: 'scientific', title: 'Scientific Writing', words: '42 WORDS', levels: ['C1'], gradient: 'from-emerald-400 via-orange-300 to-stone-800', desc: 'Technical terminology required for drafting precise lab reports, journal articles, and experimental documentation.' }
];

const WORDS_BY_TOPIC = {
  academic: [
    { term: "Mitigate", pos: "Verb", def: "To make something less severe, serious, or painful.", ex: "Drainage schemes have helped to mitigate the risk of flooding.", trans: "Làm nhẹ bớt, giảm nhẹ mức độ nghiêm trọng." },
    { term: "Paradigm", pos: "Noun", def: "A typical example or pattern of something; a model.", ex: "The new research represents a paradigm shift in our understanding.", trans: "Mô hình, hình mẫu." },
    { term: "Substantiate", pos: "Verb", def: "Provide evidence to support or prove the truth of.", ex: "The findings were substantiated by further analysis.", trans: "Chứng minh, xác minh." }
  ],
  critical: [
    { term: "Objective", pos: "Adjective", def: "Not influenced by personal feelings or opinions in considering facts.", ex: "The report provided an objective analysis.", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400" },
    { term: "Inference", pos: "Noun", def: "A conclusion reached on the basis of evidence and reasoning.", ex: "What inference can we draw from these facts?", trans: "Sự suy luận." }
  ]
};

// --- OWNER EMAIL ---
const OWNER_EMAIL = "admin@worldwords.com";

// --- Shared Components ---
const Container = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white border-[1px] border-gray-100 rounded-[24px] shadow-sm ${className} ${onClick ? 'cursor-pointer hover:shadow-xl transition-all' : ''}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", loading = false, disabled = false }) => {
  const styles = {
    primary: "bg-[#006D5B] text-white hover:bg-[#005a4b]",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    white: "bg-white text-[#006D5B] hover:bg-gray-50 shadow-md",
    ghost: "text-gray-400 hover:text-[#006D5B] font-bold"
  };
  return (
    <button onClick={onClick} disabled={loading || disabled} className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${styles[variant]} ${className}`}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

const ModernInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    {label && <label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input 
        type={type} value={value} onChange={onChange} placeholder={placeholder} 
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#006D5B] focus:bg-white transition-all font-medium text-sm`} 
      />
    </div>
  </div>
);

// --- Page: Auth (Fixed detailed error messages) ---
const AuthPage = ({ mode, onToggleMode, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        await setDoc(profileRef, { 
          name: name || "Member", goal: "7.5", streak: 1, xp: 0, rank: "New Scholar", recentLessons: [], createdAt: new Date().toISOString() 
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      let msg = "Something went wrong.";
      // Chi tiết hóa lỗi để người dùng biết tại sao không tạo được tài khoản
      switch (err.code) {
        case 'auth/weak-password': msg = "Password is too weak (min 6 chars)."; break;
        case 'auth/email-already-in-use': msg = "This email is already in use."; break;
        case 'auth/invalid-email': msg = "Invalid email address format."; break;
        case 'auth/user-not-found': msg = "No account found with this email."; break;
        case 'auth/wrong-password': msg = "Incorrect password."; break;
        default: msg = err.message;
      }
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col md:flex-row items-center justify-center gap-16 px-8 py-20 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex-1 space-y-12 max-w-xl text-left">
        <h1 className="text-7xl font-black text-gray-900 leading-[1.0] tracking-tighter">Expand your world, <br/><span className="text-[#006D5B] italic underline decoration-[12px] decoration-emerald-100 underline-offset-[-4px]">one word</span> at a time.</h1>
        <p className="text-xl text-gray-500 font-medium leading-relaxed italic">Join thousands of learners today and master English with our scientifically-backed vocabulary system.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner"><Sparkles /></div>
            <h3 className="text-lg font-bold">Personalized Growth</h3>
            <p className="text-xs text-gray-400 font-medium">Adaptive learning paths tailored to your level.</p>
          </div>
          <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner"><Users /></div>
            <h3 className="text-lg font-bold">Global Community</h3>
            <p className="text-xs text-gray-400 font-medium">Connect with learners from over 120 countries.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-12 rounded-[56px] shadow-[0_48px_80px_-24px_rgba(0,109,91,0.12)] space-y-10 border border-gray-50">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest text-[10px]">Enter your details to start your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && <ModernInput label="Full Name" placeholder="Alex Rivers" value={name} onChange={(e) => setName(e.target.value)} icon={User} />}
            <ModernInput label="Email Address" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} />
            <ModernInput label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} />
            
            {error && <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-xs font-bold text-center animate-shake">{error}</div>}

            <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-emerald-100" loading={loading}>
              {mode === 'login' ? 'Log In' : 'Create Account'} <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </form>

          <div className="text-center space-y-6">
            <p className="text-sm font-bold text-gray-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={onToggleMode} className="text-[#006D5B] font-black hover:underline underline-offset-4 decoration-2">
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page: Home ---
const HomePage = ({ onAction, user }) => (
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
      <div className="flex-1 relative">
         <div className="relative rounded-[56px] overflow-hidden border-[20px] border-white shadow-2xl h-[600px] w-full max-w-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-1000">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#006D5B]/5"></div>
         </div>
         <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-4 animate-bounce duration-[3000ms]">
            <div className="w-14 h-14 bg-emerald-50 text-[#006D5B] rounded-full flex items-center justify-center"><TrendingUp className="w-8 h-8" /></div>
            <div>
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Growth Rate</p>
               <p className="text-3xl font-black text-gray-900">150% Weekly</p>
            </div>
         </div>
      </div>
    </section>
  </div>
);

// --- APP Main Logic ---
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentTopicWords, setCurrentTopicWords] = useState(WORDS_BY_TOPIC['academic'] || []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef(null);

  // RULE 3: Auth Before Queries
  useEffect(() => {
    // For development, skip Firebase auth
    console.log("Setting demo user for development...");
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

  // Sync Profile - disabled for development
  // useEffect(() => {
  //   if (!user) {
  //     console.log("No user yet, skipping profile sync");
  //     return;
  //   }
  //   console.log("Syncing profile for user:", user.uid);
  //   setIsLoading(true);
  //   const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
  //   const unsub = onSnapshot(profileRef, (snap) => {
  //     console.log("Profile snapshot received:", snap.exists());
  //     setProfile(snap.exists() ? snap.data() : null);
  //     setIsLoading(false);
  //   }, (err) => {
  //     console.error("Firestore sync error:", err);
  //     // For development, set default profile
  //     console.log("Setting default profile");
  //     setProfile({
  //       name: "Scholar",
  //       goal: "7.5",
  //       streak: 1,
  //       xp: 0,
  //       rank: "New Scholar",
  //       recentLessons: [],
  //       createdAt: new Date().toISOString()
  //     });
  //     setIsLoading(false);
  //   });
  //   return () => unsub();
  // }, [user]);

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

  const currentTopic = TOPICS.find((topic) => topic.id === selectedTopic) || TOPICS[0];
  const currentWord = currentTopicWords[currentWordIndex] || {};
  const flashcardProgress = currentTopicWords.length ? Math.round(((currentWordIndex + 1) / currentTopicWords.length) * 100) : 0;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#006D5B] w-12 h-12 mb-4" />
      <p className="font-bold text-gray-300 uppercase tracking-[0.2em] text-[10px]">Clarity in Education</p>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onAction={setCurrentPage} user={user} />;
      case 'catalog': return (
        <div className="bg-[#F8F9FF] min-h-screen py-24 px-12 lg:px-20 space-y-16 animate-in slide-in-from-bottom duration-700">
          <div className="max-w-7xl mx-auto space-y-4 text-left">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Topic Catalog</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl italic">Select a topic to explore detailed word lists. Each collection is designed to optimize learning within specific contexts.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TOPICS.map((topic) => (
              <Container key={topic.id} className="p-0 overflow-hidden flex flex-col group hover:-translate-y-4 duration-1000 border-none shadow-xl" onClick={() => selectTopic(topic.id)}>
                <div className={`h-64 bg-gradient-to-br ${topic.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 backdrop-blur-3xl opacity-60" />
                  <div className={`absolute top-8 left-8 px-5 py-2 bg-[#00E5BC] text-white text-[10px] font-black uppercase rounded-full shadow-lg tracking-widest`}>{topic.words}</div>
                </div>
                <div className="p-12 flex flex-col flex-1 space-y-6">
                  <h3 className="text-3xl font-black text-gray-900 group-hover:text-[#006D5B] transition-colors">{topic.title}</h3>
                  <p className="text-base text-gray-400 font-medium leading-relaxed flex-1 opacity-70">"{topic.desc}"</p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                    <div className="flex gap-2">
                       {topic.levels.map(l => <span key={l} className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-[11px] font-black text-gray-400 border border-gray-100`}>{l}</span>)}
                    </div>
                    <button onClick={() => setCurrentPage('flashcards')} className="flex items-center gap-2 text-[#006D5B] font-black text-sm hover:gap-4 transition-all uppercase tracking-widest">Start Flashcards <ArrowRight className="w-5 h-5" /></button>
                  </div>
                </div>
              </Container>
            ))}
          </div>
        </div>
      );
      case 'gallery_detail':
        const topic = TOPICS.find(t => t.id === selectedTopic);
        return (
          <div className="bg-[#F8F9FF] min-h-screen py-12 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-12">
               <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <button onClick={() => setCurrentPage('catalog')} className="hover:text-gray-900">Topics</button> <ChevronDown className="w-4 h-4 -rotate-90" /> <span className="text-gray-900">{topic?.title}</span>
               </div>
               <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  <div className="flex-1 space-y-4 text-left">
                    <h1 className="text-8xl font-black text-gray-900 tracking-tighter italic leading-none">{topic?.title}</h1>
                    <p className="text-2xl text-gray-400 max-w-2xl font-medium italic">{topic?.desc}</p>
                    <Button variant="white" onClick={() => setCurrentPage('catalog')} className="mt-4 border border-gray-100"><ArrowLeft className="w-4 h-4" /> Back to Catalog</Button>
                  </div>
                  <div className="w-full lg:w-96 bg-white p-10 rounded-[48px] shadow-2xl border border-white space-y-6">
                     <div className="flex justify-between items-center"><h4 className="font-bold text-gray-900">Mastery Progress</h4><span className="text-xs font-black text-[#006D5B]">0% Complete</span></div>
                     <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-[#006D5B] w-0 transition-all duration-1000" /></div>
                     <div className="flex items-center gap-3 text-sm font-bold text-gray-300 italic"><CheckCircle2 className="w-5 h-5 text-emerald-100" /> Keep going! You're just starting.</div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-40">
                  {(WORDS_BY_TOPIC[selectedTopic] || []).map((w, idx) => (
                    <Container key={idx} className="p-12 space-y-8 border-none shadow-2xl relative overflow-hidden group">
                       <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-2">
                             <span className="px-4 py-1.5 bg-emerald-50 text-[#006D5B] rounded-full text-xs font-black uppercase tracking-widest">{w.pos}</span>
                             <h3 className="text-5xl font-black text-gray-900 group-hover:text-[#006D5B] transition-colors tracking-tighter">{w.term}</h3>
                          </div>
                          <button onClick={() => onStartTTS(w.term)} className="p-4 text-gray-200 hover:text-[#006D5B] hover:bg-emerald-50 rounded-full transition-all"><Volume2 className="w-8 h-8" /></button>
                       </div>
                       <p className="text-2xl text-gray-500 font-medium italic leading-relaxed border-l-[12px] border-emerald-500/10 pl-8">"{w.def}"</p>
                       <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100"><p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-3">Academic Context</p><p className="text-xl text-gray-600 font-medium italic leading-relaxed">"{w.ex}"</p></div>
                       <div className="flex justify-between items-center pt-4 relative z-10"><Button variant="ghost" className="px-0 text-xs">Review Details <ArrowRight className="w-4 h-4 ml-1" /></Button><button className="text-gray-200 hover:text-[#006D5B] transition-colors"><Bookmark className="w-6 h-6" /></button></div>
                       <Sparkles className="absolute -bottom-4 -right-4 w-40 h-40 opacity-5 text-emerald-500 group-hover:opacity-10 transition-opacity" />
                    </Container>
                  ))}
                  <div className="bg-[#006D5B] p-16 rounded-[64px] shadow-2xl text-white flex flex-col items-center justify-center text-center space-y-8 md:col-span-2">
                     <BrainCircuit className="w-20 h-20 text-emerald-300" />
                     <div className="space-y-4"><h3 className="text-5xl font-black tracking-tight">Ready for a challenge?</h3><p className="text-2xl text-emerald-100 font-medium max-w-xl opacity-80 italic">Practice your selected topic with a focused flashcard session.</p></div>
                     <Button variant="white" className="px-20 py-6 text-2xl rounded-3xl font-black" onClick={() => setCurrentPage('flashcards')}>Start Flashcards</Button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'auth': return <AuthPage mode="signup" onToggleMode={() => setCurrentPage('login')} onAuthSuccess={() => setCurrentPage('dashboard')} />;
      case 'login': return <AuthPage mode="login" onToggleMode={() => setCurrentPage('auth')} onAuthSuccess={() => setCurrentPage('dashboard')} />;
      case 'flashcards': return (
        <div className="bg-[#F8F9FF] min-h-screen py-24 px-6 lg:px-24">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-black mb-3">{currentTopic.title}</div>
                <h1 className="text-6xl font-black text-gray-900 leading-tight">Flashcards Canvas</h1>
                <p className="text-lg text-gray-500 mt-4 max-w-2xl">Sequential learning built around a single current index. Tap the card to reveal the Vietnamese answer and use the buttons to continue.</p>
              </div>
              <Button variant="white" className="border border-gray-200" onClick={() => setCurrentPage('gallery_detail')}>
                Back to Topic
              </Button>
            </div>

            {!currentTopicWords.length ? (
              <div className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-lg text-center">
                <p className="text-xl text-gray-500">No flashcards are available for this topic yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[48px] shadow-2xl p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-bold">Progress</div>
                    <div className="text-4xl font-black text-[#006D5B] mt-2">{currentWordIndex + 1} / {currentTopicWords.length}</div>
                  </div>
                  <div className="w-full lg:w-96 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-[#006D5B] transition-all" style={{ width: `${flashcardProgress}%` }} />
                  </div>
                </div>

                <div className="relative w-full h-[520px] perspective-1000">
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    <div onClick={handleFlipCard} className="absolute inset-0 bg-white border border-gray-200 rounded-[40px] p-10 shadow-2xl backface-hidden flex flex-col justify-between cursor-pointer">
                      <div>
                        <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-black">Tap to reveal</div>
                        <div className="text-5xl font-black text-gray-900 mt-10">{currentWord.term || 'No word selected'}</div>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F8F2] text-[#04634D] text-sm font-bold">{currentWord.pos || 'Part of speech'}</div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-500">{currentWord.def || 'Definition will appear here.'}</p>
                        <p className="text-sm text-gray-400 italic">Example: {currentWord.ex || 'Example sentence.'}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Front Side</span>
                        <span className="font-bold">{isFlipped ? 'Back' : 'Front'}</span>
                      </div>
                    </div>

                    <div onClick={handleFlipCard} className="absolute inset-0 bg-[#006D5B] border border-[#0f5138] rounded-[40px] p-10 shadow-2xl backface-hidden rotate-y-180 text-white flex flex-col justify-between cursor-pointer">
                      <div>
                        <div className="text-sm uppercase tracking-[0.35em] text-emerald-200 font-black">Answer Revealed</div>
                        <div className="text-5xl font-black mt-10">{currentWord.trans || 'Translation will appear here'}</div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-lg leading-relaxed">{currentWord.def || 'Definition will appear here.'}</p>
                        {currentWord.ex && <p className="text-sm italic opacity-80">Example: {currentWord.ex}</p>}
                      </div>
                      <div className="flex items-center justify-between text-sm text-emerald-200">
                        <span>Back Side</span>
                        <span className="font-bold">{isFlipped ? 'Tap to hide' : 'Tap to reveal'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => handleNavigation('reset')} className="rounded-3xl">Reset</Button>
                    <Button variant="ghost" onClick={() => handleNavigation('next')} className="rounded-3xl">Easy</Button>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => handleNavigation('next')} className="rounded-3xl">Next</Button>
                    <Button variant="white" className="rounded-3xl" onClick={() => onStartTTS(currentWord.term)}>Listen</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

      case 'dashboard': return (
        <div className="py-40 text-center max-w-5xl mx-auto px-6 space-y-12">
          <Trophy className="w-32 h-32 mx-auto text-yellow-500 drop-shadow-2xl" />
          <h1 className="text-9xl font-black text-gray-900 tracking-tighter italic leading-none underline decoration-[#006D5B] decoration-[16px] underline-offset-[-4px]">Hi, {profile?.name || "Scholar"}!</h1>
          <p className="text-3xl text-gray-400 font-medium max-w-2xl mx-auto">Your IELTS journey is synced across devices. Let's master some more words.</p>
          <div className="flex gap-8 justify-center pt-10">
             <Button className="px-16 py-7 text-3xl shadow-2xl shadow-emerald-200 rounded-3xl" onClick={() => setCurrentPage('catalog')}>Explore Gallery</Button>
             <Button variant="outline" className="px-16 py-7 text-3xl rounded-3xl" onClick={() => { signOut(auth); setCurrentPage('home'); }}>Log Out</Button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#006D5B] selection:text-white">
      <audio ref={audioRef} className="hidden" />
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 border-b border-gray-50 py-6 px-12 lg:px-24 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
          <div className="bg-[#006D5B] text-white p-2 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-emerald-200"><BookOpen className="w-8 h-8" /></div>
          <span className="text-3xl font-black tracking-tighter uppercase text-gray-900">WORLDWORDS</span>
        </div>
        <div className="flex gap-12 font-black text-[10px] uppercase items-center text-gray-400 tracking-[0.3em]">
          <button onClick={() => setCurrentPage('home')} className={`hover:text-gray-900 transition-colors ${currentPage === 'home' ? 'text-gray-900' : ''}`}>Home</button>
          <button onClick={() => { if(user?.isAnonymous) setCurrentPage('auth'); else setCurrentPage('dashboard'); }} className={`hover:text-gray-900 transition-colors ${currentPage === 'dashboard' ? 'text-gray-900' : ''}`}>Dashboard</button>
          <button onClick={() => setCurrentPage('catalog')} className={`hover:text-gray-900 transition-all relative ${currentPage.includes('catalog') || currentPage.includes('gallery') ? 'text-gray-900 after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#006D5B]' : ''}`}>Gallery</button>
          <button onClick={() => setCurrentPage(selectedTopic ? 'flashcards' : 'catalog')} className={`hover:text-gray-900 transition-all ${currentPage === 'flashcards' || currentPage.includes('catalog') ? 'text-gray-900' : ''}`}>Flashcards</button>
          <button className="hover:text-gray-900 transition-colors opacity-30 cursor-not-allowed">Quiz</button>
          <div className="flex items-center gap-8 pl-8 border-l border-gray-100">
             <Search className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
             <div onClick={() => { if(user?.isAnonymous) setCurrentPage('auth'); else setCurrentPage('dashboard'); }} className="flex items-center">
                {user?.isAnonymous ? (
                  <Button variant="primary" className="py-2.5 px-8 text-[11px] rounded-xl shadow-lg shadow-emerald-100">SIGN IN</Button>
                ) : (
                  <div className="w-12 h-12 bg-emerald-50 text-[#006D5B] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    {profile?.name?.substring(0,2).toUpperCase() || "JD"}
                  </div>
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