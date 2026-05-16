import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInAnonymously, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithCustomToken, sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { 
  BookOpen, User, Search, Trophy, ArrowRight, CheckCircle2, BrainCircuit, TrendingUp,
  LogOut, GraduationCap, MessageSquare, Globe, Star, Zap, Filter, ArrowLeft, Volume2,
  Bookmark, Target, Flame, History, Mail, Lock, Sparkles, Users, Loader2, XCircle,
  ShieldCheck, UserPlus, Crown, Activity, Database, ChevronDown, PlayCircle, Eye, EyeOff, KeyRound
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// --- Cấu hình Firebase ---
const DEMO_MODE = true; // Set to false when you have valid Firebase keys
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

let app, auth, db;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'world-words-default';

try {
  if (DEMO_MODE || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_real_api_key') {
    console.warn('🎭 DEMO MODE ENABLED - Using offline development mode. Firebase auth is disabled.');
    app = null;
    auth = null;
    db = null;
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('🎭 Falling back to DEMO MODE');
  app = null;
  auth = null;
  db = null;
}

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
  { id: 'academic', title: 'Academic Excellence', words: '45 WORDS', levels: ['A1', 'C1'], img: '/imgs/academic.jpg', desc: 'Master advanced vocabulary tailored for university-level research and scholarly presentations.' },
  { id: 'business', title: 'Business Communication', words: '22 WORDS', levels: ['B2'], img: '/imgs/business.jpg', desc: 'Master professional terminology for negotiations, meetings, and project management.' },
  { id: 'daily', title: 'Daily Conversations', words: '68 WORDS', levels: ['A2'], img: '/imgs/daily.jpg', desc: 'Common phrases and idioms to help you communicate naturally like a native speaker.' },
  { id: 'research', title: 'Research Methodology', words: '28 WORDS', levels: ['C1'], img: '/imgs/research.jpg', desc: 'Master the terminology of systematic investigation and academic inquiry.' },
  { id: 'critical', title: 'Critical Analysis', words: '25 WORDS', levels: ['B2', 'C1'], img: '/imgs/critical.jpg', desc: 'Essential vocabulary for evaluating complex arguments and synthesizing diverse sources.' },
  { id: 'scientific', title: 'Scientific Writing', words: '42 WORDS', levels: ['C1'], img: '/imgs/scientific.jpg', desc: 'Technical terminology required for drafting precise journal articles and documentation.' }
];

const WORDS_BY_TOPIC = {
  academic: [
    { term: "Mitigate", pos: "Verb", def: "To make something less severe, serious, or painful.", ex: "Drainage schemes have helped to mitigate the risk of flooding.", trans: "Làm nhẹ bớt, giảm nhẹ mức độ nghiêm trọng." },
    { term: "Paradigm", pos: "Noun", def: "A typical example or pattern of something; a model.", ex: "The new research represents a paradigm shift in our understanding.", trans: "Mô hình, hình mẫu." },
    { term: "Substantiate", pos: "Verb", def: "Provide evidence to support or prove the truth of.", ex: "The findings were substantiated by further analysis.", trans: "Chứng minh, xác minh." },
    { term: "Ephemeral", pos: "Adjective", def: "Lasting for a very short time.", ex: "Fashions are ephemeral.", trans: "Chóng tàn, phù du." },
    { term: "Ebullient", pos: "Adjective", def: "Cheerful and full of energy.", ex: "The ebullient atmosphere at the university gala was contagious.", trans: "Sôi nổi, hăng hái." },
    { term: "Ubiquitous", pos: "Adjective", def: "Present, appearing, or found everywhere.", ex: "Computers are now ubiquitous in modern education environments.", trans: "Có mặt ở khắp nơi." }
  ],
  business: [
    { term: "Pragmatic", pos: "Adjective", def: "Dealing with things sensibly and realistically.", ex: "We need to take a pragmatic approach to the problem.", trans: "Thực tế, thực dụng." },
    { term: "Synergy", pos: "Noun", def: "The combined power of a group of things when they are working together.", ex: "The synergy between the two companies will create more value.", trans: "Sự hợp lực, sức mạnh tổng hợp." },
    { term: "Lucrative", pos: "Adjective", def: "Producing a great deal of profit.", ex: "The software business is a lucrative industry.", trans: "Sinh lợi, có lời." },
    { term: "Negotiate", pos: "Verb", def: "To reach an agreement through discussion.", ex: "The two companies are still negotiating the terms.", trans: "Đàm phán." },
    { term: "Leverage", pos: "Verb", def: "To use something to maximum advantage.", ex: "We should leverage our existing network.", trans: "Tận dụng lợi thế." },
    { term: "Stakes", pos: "Noun", def: "The potential risks or rewards in a given situation.", ex: "The stakes are high in this acquisition.", trans: "Rủi ro hoặc phần thưởng tiềm năng." }
  ],
  daily: [
    { term: "Resilient", pos: "Adjective", def: "Able to withstand or recover quickly from difficult conditions.", ex: "Babies are generally far more resilient than new parents realize.", trans: "Kiên cường, mau phục hồi." },
    { term: "Nostalgia", pos: "Noun", def: "A sentimental longing or wistful affection for the past.", ex: "I was overcome with acute nostalgia for my days in college.", trans: "Sự hoài niệm." },
    { term: "Serendipity", pos: "Noun", def: "The occurrence and development of events by chance in a happy or beneficial way.", ex: "A fortunate stroke of serendipity.", trans: "Sự tình cờ may mắn." },
    { term: "Catch up", pos: "Phrasal Verb", def: "To talk to someone you haven't seen for a while.", ex: "Let's grab a coffee and catch up!", trans: "Trò chuyện sau một thời gian." },
    { term: "Break the ice", pos: "Idiom", def: "To say or do something that makes people feel more relaxed.", ex: "He told a joke to break the ice.", trans: "Phá vỡ sự ngượng ngùng." },
    { term: "Hang out", pos: "Phrasal Verb", def: "To spend time relaxing.", ex: "We usually hang out at the park on weekends.", trans: "Đi chơi, thư giãn." }
  ],
  research: [
    { term: "Empirical", pos: "Adjective", def: "Based on observation or experience rather than theory.", ex: "They provided empirical evidence for their claims.", trans: "Thực nghiệm." },
    { term: "Qualitative", pos: "Adjective", def: "Relating to, measuring, or measured by the quality of something.", ex: "The study used qualitative interviews.", trans: "Định tính." },
    { term: "Methodology", pos: "Noun", def: "A system of methods used in a particular area of study.", ex: "The methodology was clearly outlined in the paper.", trans: "Phương pháp luận." },
    { term: "Correlation", pos: "Noun", def: "A mutual relationship or connection between two or more things.", ex: "There is a strong correlation between these two variables.", trans: "Sự tương quan." },
    { term: "Peer-reviewed", pos: "Adjective", def: "Evaluated by experts in the same field before publication.", ex: "The results were published in a peer-reviewed journal.", trans: "Được bình duyệt." },
    { term: "Quantitative", pos: "Adjective", def: "Relating to, measuring, or measured by the quantity of something.", ex: "The researchers gathered extensive quantitative data.", trans: "Định lượng." }
  ],
  critical: [
    { term: "Objective", pos: "Adjective", def: "Not influenced by personal feelings or opinions in considering facts.", ex: "The report provided an objective analysis.", trans: "Khách quan." },
    { term: "Inference", pos: "Noun", def: "A conclusion reached on the basis of evidence and reasoning.", ex: "What inference can we draw from these facts?", trans: "Sự suy luận." },
    { term: "Synthesize", pos: "Verb", def: "Combine (a number of things) into a coherent whole.", ex: "Pupils should synthesize the data they have gathered.", trans: "Tổng hợp." },
    { term: "Subjective", pos: "Adjective", def: "Based on or influenced by personal feelings, tastes, or opinions.", ex: "Art criticism is highly subjective.", trans: "Chủ quan." },
    { term: "Bias", pos: "Noun", def: "Prejudice in favor of or against one thing, person, or group.", ex: "The study was criticized for its inherent bias.", trans: "Sự thiên vị." },
    { term: "Scrutinize", pos: "Verb", def: "Examine or inspect closely and thoroughly.", ex: "Customers were warned to scrutinize the small print.", trans: "Xem xét kỹ lưỡng." }
  ],
  scientific: [
    { term: "Hypothesis", pos: "Noun", def: "A proposed explanation made on the basis of limited evidence.", ex: "The researchers tested their hypothesis in the lab.", trans: "Giả thuyết." },
    { term: "Catalyst", pos: "Noun", def: "A substance that increases the rate of a chemical reaction.", ex: "Chlorine acts as a catalyst promoting the breakdown of ozone.", trans: "Chất xúc tác." },
    { term: "Variables", pos: "Noun", def: "An element, feature, or factor that is liable to vary or change.", ex: "There are too many variables in the experiment to predict the result.", trans: "Biến số." },
    { term: "Replicate", pos: "Verb", def: "Make an exact copy of; reproduce.", ex: "They failed to replicate the original experimental findings.", trans: "Tái tạo, sao chép." },
    { term: "Control group", pos: "Noun", def: "The group in an experiment or study that does not receive treatment.", ex: "The control group received a placebo instead of the drug.", trans: "Nhóm đối chứng." },
    { term: "Anomaly", pos: "Noun", def: "Something that deviates from what is standard, normal, or expected.", ex: "There was a significant anomaly in the test results.", trans: "Sự dị thường." }
  ]
};

// --- OWNER EMAIL ---
const OWNER_EMAIL = "admin@worldwords.com";

// --- Shared Components ---
const Container = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white border-[1px] border-gray-100 rounded-[24px] shadow-sm ${className} ${onClick ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out' : ''}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", loading = false, disabled = false }) => {
  const styles = {
    primary: "bg-[#006D5B] text-white hover:bg-[#005a4b] shadow-md hover:shadow-lg hover:shadow-[#006D5B]/30",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    white: "bg-white text-[#006D5B] hover:bg-gray-50 shadow-md hover:shadow-xl",
    ghost: "text-gray-400 hover:text-[#006D5B] font-bold hover:bg-gray-50"
  };
  return (
    <button onClick={onClick} disabled={loading || disabled} className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

const ModernInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon, rightElement }) => (
  <div className="flex flex-col gap-2 w-full text-left">
    {label && <label className="font-bold text-[11px] uppercase tracking-widest text-gray-500 ml-1">{label}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006D5B] transition-colors" />}
      <input 
        type={type} value={value} onChange={onChange} placeholder={placeholder} 
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-4 bg-gray-50/80 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#006D5B] focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-medium text-[15px] placeholder:text-gray-400`} 
      />
      {rightElement && <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>}
    </div>
  </div>
);

// --- Page: Auth (Fixed detailed error messages) ---
const AuthPage = ({ mode, onToggleMode, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      if (DEMO_MODE || !auth) {
        setTimeout(() => setSuccessMsg("Demo mode: A password reset link has been sent to your email!"), 1000);
      } else {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Reset link sent! Please check your email inbox.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(DEMO_MODE ? true : false); // artificial delay for demo
      if (DEMO_MODE) setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotMode) {
       return handleResetPassword(e);
    }
    
    if (loading) return;
    
    // Demo mode - bypass auth and save to localStorage
    if (DEMO_MODE || !auth) {
      console.log('Demo mode - creating new account');
      // Generate completely unique ID for each account
      const uniqueId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userData = {
        uid: uniqueId,
        email: email,
        name: name || email.split('@')[0],
        goal: "7.5", 
        streak: 1, 
        xp: 0, 
        rank: "New Scholar", 
        recentLessons: [], 
        createdAt: new Date().toISOString()
      };
      console.log('✓ New account created with ID:', uniqueId);
      localStorage.setItem('worldwords_user', JSON.stringify(userData));
      onAuthSuccess();
      return;
    }

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
            <p className="text-xs text-gray-600 font-medium">Adaptive learning paths tailored to your level.</p>
          </div>
          <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner"><Users /></div>
            <h3 className="text-lg font-bold">Global Community</h3>
            <p className="text-xs text-gray-600 font-medium">Connect with learners from over 120 countries.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-12 rounded-[48px] shadow-2xl space-y-10 border border-gray-100 hover:shadow-[0_32px_80px_-24px_rgba(0,109,91,0.15)] transition-shadow duration-700">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#E8F8F2] text-[#006D5B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><KeyRound className="w-8 h-8" /></div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
               {isForgotMode ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest text-[10px]">
               {isForgotMode ? 'Enter your email to receive a reset link.' : 'Enter your details to start your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isForgotMode && mode === 'signup' && (
               <ModernInput label="Full Name" placeholder="Alex Rivers" value={name} onChange={(e) => setName(e.target.value)} icon={User} />
            )}
            
            <ModernInput label="Email Address" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} />
            
            {!isForgotMode && (
               <div className="space-y-3">
                  <ModernInput 
                     label="Password" 
                     type={showPassword ? "text" : "password"} 
                     placeholder="••••••••" 
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)} 
                     icon={Lock} 
                     rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                     }
                  />
                  {mode === 'login' && (
                     <div className="flex justify-end">
                        <button type="button" onClick={() => { setIsForgotMode(true); setError(''); setSuccessMsg(''); }} className="text-[#006D5B] text-xs font-bold hover:underline">Forgot password?</button>
                     </div>
                  )}
               </div>
            )}
            
            {error && <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-bold text-center animate-shake flex items-center gap-2 justify-center"><XCircle className="w-4 h-4" /> {error}</div>}
            {successMsg && <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-[#006D5B] text-sm font-bold text-center flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

            <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-emerald-100" loading={loading}>
              {isForgotMode ? 'Send Reset Link' : mode === 'login' ? 'Log In' : 'Create Account'} <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </form>

          <div className="text-center space-y-6 pt-4 border-t border-gray-50">
            {isForgotMode ? (
               <button onClick={() => { setIsForgotMode(false); setError(''); setSuccessMsg(''); }} className="text-gray-500 font-bold hover:text-gray-900 transition-colors flex items-center justify-center gap-2 w-full">
                 <ArrowLeft className="w-4 h-4" /> Back to Log In
               </button>
            ) : (
               <p className="text-sm font-bold text-gray-600">
                 {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                 <button onClick={() => { onToggleMode(); setError(''); }} className="text-[#006D5B] font-black hover:underline underline-offset-4 decoration-2">
                   {mode === 'login' ? 'Sign up' : 'Log in'}
                 </button>
               </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page: Profile ---
const ProfilePage = ({ profile, onLogout, onGoHome, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || "",
    rank: profile?.rank || "New Scholar",
    streak: profile?.streak || 1,
    xp: profile?.xp || 0,
    goal: profile?.goal || "7.5"
  });

  const handleSaveChanges = () => {
    onProfileUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] py-20 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <button onClick={onGoHome} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-12 font-bold uppercase tracking-widest text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white rounded-[56px] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006D5B] to-[#0D9488] p-12 text-white flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-emerald-300 text-[#006D5B] font-black flex items-center justify-center rounded-full text-4xl border-4 border-white shadow-lg">
                {editData.name?.substring(0, 2).toUpperCase() || "JD"}
              </div>
              <div>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-5xl font-black tracking-tight bg-transparent text-white border-b-2 border-white outline-none mb-2"
                  />
                ) : (
                  <h1 className="text-5xl font-black tracking-tight">{editData.name || "Scholar"}</h1>
                )}
                <p className="text-emerald-100 text-lg font-medium mt-2">{profile?.email || "member@worldwords.com"}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-white text-[#006D5B] rounded-xl font-bold hover:bg-emerald-50 transition-all"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-12 space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 text-center space-y-2">
                <Trophy className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.rank}
                    onChange={(e) => setEditData({...editData, rank: e.target.value})}
                    className="text-3xl font-black text-gray-900 bg-white border border-emerald-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-3xl font-black text-gray-900">{editData.rank}</p>
                )}
              </div>

              <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 text-center space-y-2">
                <Flame className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Streak</p>
                {isEditing ? (
                  <input 
                    type="number"
                    value={editData.streak}
                    onChange={(e) => setEditData({...editData, streak: parseInt(e.target.value) || 0})}
                    className="text-3xl font-black text-gray-900 bg-white border border-blue-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-3xl font-black text-gray-900">{editData.streak} days</p>
                )}
              </div>

              <div className="bg-orange-50 p-8 rounded-[32px] border border-orange-100 text-center space-y-2">
                <Zap className="w-12 h-12 text-orange-600 mx-auto" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">XP Points</p>
                {isEditing ? (
                  <input 
                    type="number"
                    value={editData.xp}
                    onChange={(e) => setEditData({...editData, xp: parseInt(e.target.value) || 0})}
                    className="text-3xl font-black text-gray-900 bg-white border border-orange-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-3xl font-black text-gray-900">{editData.xp}</p>
                )}
              </div>

              <div className="bg-purple-50 p-8 rounded-[32px] border border-purple-100 text-center space-y-2">
                <Target className="w-12 h-12 text-purple-600 mx-auto" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">IELTS Goal</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.goal}
                    onChange={(e) => setEditData({...editData, goal: e.target.value})}
                    className="text-3xl font-black text-gray-900 bg-white border border-purple-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-3xl font-black text-gray-900">{editData.goal}</p>
                )}
              </div>
            </div>

            {/* Learning Path */}
            <div className="border-t border-gray-100 pt-12 space-y-6">
              <h2 className="text-3xl font-black text-gray-900">Learning Journey</h2>
              <p className="text-gray-400 font-medium">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'recently'}</p>
              <div className="flex gap-4 flex-wrap">
                {(profile?.recentLessons || []).length > 0 ? (
                  profile.recentLessons.map((lesson, idx) => (
                    <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
                      {lesson}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-300 italic">No lessons completed yet. Start exploring!</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 pt-12 flex gap-4 flex-col sm:flex-row">
              {isEditing ? (
                <>
                  <Button className="flex-1 py-4 text-lg rounded-3xl bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1 py-4 text-lg rounded-3xl" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 py-4 text-lg rounded-3xl">
                    <Mail className="w-5 h-5 mr-2" /> Update Email
                  </Button>
                  <Button variant="outline" className="flex-1 py-4 text-lg rounded-3xl">
                    <Lock className="w-5 h-5 mr-2" /> Change Password
                  </Button>
                  <Button variant="white" onClick={onLogout} className="flex-1 py-4 text-lg rounded-3xl border border-red-200 text-red-600 hover:bg-red-50">
                    <LogOut className="w-5 h-5 mr-2" /> Log Out
                  </Button>
                </>
              )}
            </div>
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



// --- APP Main Logic ---
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
  // --- NEW: learned words per topic {topicId: Set of term strings} ---
  const [learnedWords, setLearnedWords] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ww_learned') || '{}'); } catch { return {}; }
  });
  // --- NEW: bookmarked words [{topicId, term}] ---
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ww_bookmarks') || '[]'); } catch { return []; }
  });
  // --- NEW: quiz state ---
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // RULE 3: Auth Before Queries
  useEffect(() => {
    // Check localStorage for existing user on app load
    const savedUser = localStorage.getItem('worldwords_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Validate the user data has required fields
        if (userData.uid && userData.email && userData.name) {
          console.log("✓ Loading user from localStorage:", userData.uid);
          setUser({ isAnonymous: false, uid: userData.uid, email: userData.email });
          setProfile(userData);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        localStorage.removeItem('worldwords_user');
      }
    }
    
    // No valid user found - set demo user
    console.log("🎭 Starting in demo mode - no saved user");
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

  // --- NEW: Mark current word as learned ---
  const markLearned = (topicId, term) => {
    setLearnedWords(prev => {
      const updated = { ...prev, [topicId]: [...(prev[topicId] || []), term].filter((v,i,a)=>a.indexOf(v)===i) };
      localStorage.setItem('ww_learned', JSON.stringify(updated));
      return updated;
    });
  };

  // --- NEW: Toggle bookmark ---
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

  // --- NEW: Start quiz (6 random questions from topic) ---
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

  const currentTopic = TOPICS.find((topic) => topic.id === selectedTopic) || TOPICS[0];
  const currentWord = currentTopicWords[currentWordIndex] || {};
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
      case 'home': return <HomePage onAction={setCurrentPage} user={user} />;

      case 'catalog': return (
        <div className="bg-[#F8F9FF] min-h-screen py-24 px-12 lg:px-20 space-y-16 animate-in slide-in-from-bottom duration-700">
          <div className="max-w-7xl mx-auto space-y-4 text-left">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Flashcards</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl italic">Choose a topic and start learning with interactive flashcards. Each collection is designed to optimize your vocabulary growth.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TOPICS.map((topic) => (
              <Container key={topic.id} className="p-0 overflow-hidden flex flex-col group hover:-translate-y-4 transition-all duration-500 ease-out border-none shadow-xl hover:shadow-2xl" onClick={() => selectTopic(topic.id)}>
                <div className="h-64 relative overflow-hidden">
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
            ) : learnedCount >= topicTotal && topicTotal > 0 ? (
              <div className="bg-white border border-gray-100 rounded-[48px] shadow-2xl p-12 text-center space-y-8">
                <div className="text-8xl animate-bounce">🎉</div>
                <h2 className="text-5xl font-black text-gray-900">Topic Complete!</h2>
                <p className="text-xl text-gray-500 font-medium">You have mastered all <span className="font-black text-[#006D5B]">{topicTotal} words</span> in this topic!</p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button onClick={() => startQuiz(selectedTopic)} className="rounded-3xl px-8 py-4 text-lg"><Zap className="w-5 h-5" /> Take the Quiz</Button>
                  <Button variant="outline" onClick={() => setCurrentPage('catalog')} className="rounded-3xl px-8 py-4 text-lg">Browse Topics</Button>
                  <Button variant="ghost" onClick={() => { setLearnedWords(prev => { const u = {...prev}; delete u[selectedTopic]; localStorage.setItem('ww_learned', JSON.stringify(u)); return u; }); setCurrentWordIndex(0); setIsFlipped(false); }} className="rounded-3xl px-8 py-4 text-lg">Study Again</Button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[48px] shadow-2xl p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-gray-400 font-bold">Progress</div>
                    <div className="text-4xl font-black text-[#006D5B] mt-2">{currentWordIndex + 1} / {currentTopicWords.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Mastered: <span className="font-bold text-emerald-600">{learnedCount}/{topicTotal}</span></div>
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
                    <button
                      onClick={() => toggleBookmark(selectedTopic, currentWord)}
                      className={`px-5 py-3 rounded-3xl border font-bold flex items-center gap-2 text-sm transition-all ${ isBookmarked(selectedTopic, currentWord.term) ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-500' }`}
                    >
                      <Bookmark className="w-4 h-4" fill={isBookmarked(selectedTopic, currentWord.term) ? 'currentColor' : 'none'} />
                      {isBookmarked(selectedTopic, currentWord.term) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      disabled={!isFlipped}
                      onClick={() => { markLearned(selectedTopic, currentWord.term); handleNavigation('next'); }}
                      title={!isFlipped ? 'Flip the card to see the answer first' : ''}
                      className={`px-6 py-3 rounded-3xl font-bold flex items-center gap-2 transition-all ${
                        isFlipped
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg hover:-translate-y-1'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" /> Got it
                    </button>
                    <Button onClick={() => handleNavigation('next')} className="rounded-3xl">Next</Button>
                    <Button variant="white" className="rounded-3xl" onClick={() => onStartTTS(currentWord.term)}>Listen</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

      case 'quiz':
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
                            if (opt === q.correct) setQuizScore(s => s + 1);
                            setTimeout(() => {
                              if (quizIndex + 1 >= quizQuestions.length) setQuizDone(true);
                              else { setQuizIndex(qi => qi + 1); setQuizSelected(null); }
                            }, 900);
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

      case 'dashboard': return (
        <div className="py-40 text-center max-w-5xl mx-auto px-6 space-y-12">
          <Trophy className="w-32 h-32 mx-auto text-yellow-500 drop-shadow-2xl" />
          <h1 className="text-9xl font-black text-gray-900 tracking-tighter italic leading-none underline decoration-[#006D5B] decoration-[16px] underline-offset-[-4px]">Hi, {profile?.name || "Scholar"}!</h1>
          <p className="text-3xl text-gray-600 font-medium max-w-2xl mx-auto">You are making incredible progress! Your IELTS journey is synced across devices. Let's master some more words and achieve greatness today!</p>
          <div className="flex gap-8 justify-center pt-10">
             <Button className="px-16 py-7 text-3xl shadow-2xl shadow-emerald-200 rounded-3xl" onClick={() => setCurrentPage('catalog')}>Explore Gallery</Button>
             <Button variant="outline" className="px-16 py-7 text-3xl rounded-3xl" onClick={() => setCurrentPage('profile')}>View Profile</Button>
          </div>
        </div>
      );
      case 'profile': return (
        <ProfilePage 
          profile={profile} 
          onLogout={() => {
            console.log('🚪 Logging out - clearing all user data...');
            // Completely clear localStorage
            localStorage.removeItem('worldwords_user');
            localStorage.clear(); // Nuclear option - clear everything
            
            // Reset user to anonymous demo state
            setUser({ isAnonymous: true, uid: 'demo-user' });
            
            // Reset profile to fresh default
            const freshProfile = { 
              name: "Scholar", 
              goal: "7.5", 
              streak: 1, 
              xp: 0, 
              rank: "New Scholar", 
              recentLessons: [], 
              createdAt: new Date().toISOString() 
            };
            setProfile(freshProfile);
            
            // Reset page navigation
            setCurrentPage('home');
            setSelectedTopic(null);
            setCurrentWordIndex(0);
            setIsFlipped(false);
            
            console.log('✓ Logout complete - ready for new account');
          }}
          onGoHome={() => setCurrentPage('home')}
          onProfileUpdate={(updatedData) => {
            const updatedProfile = { ...profile, ...updatedData };
            setProfile(updatedProfile);
            localStorage.setItem('worldwords_user', JSON.stringify(updatedProfile));
          }}
        />
      );
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
