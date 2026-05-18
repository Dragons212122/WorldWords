import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, Users, ArrowRight, CheckCircle2, KeyRound, Eye, EyeOff, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ModernInput } from '../components/ui/ModernInput';
import { auth, db, DEMO_MODE, appId, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, doc, setDoc } from '../services/firebase';

export const AuthPage = ({ mode, onToggleMode, onAuthSuccess }) => {
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
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 px-4 md:px-8 py-10 md:py-20 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex-1 space-y-8 md:space-y-12 max-w-xl text-left">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] md:leading-[1.0] tracking-tighter">Expand your world, <br/><span className="text-[#006D5B] italic underline decoration-[8px] md:decoration-[12px] decoration-emerald-100 underline-offset-[-4px]">one word</span> at a time.</h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed italic">Join thousands of learners today and master English with our scientifically-backed vocabulary system.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="p-6 md:p-8 bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-3 md:space-y-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner"><Sparkles className="w-5 h-5 md:w-6 md:h-6" /></div>
            <h3 className="text-base md:text-lg font-bold">Personalized Growth</h3>
            <p className="text-xs text-gray-600 font-medium">Adaptive learning paths tailored to your level.</p>
          </div>
          <div className="p-6 md:p-8 bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-3 md:space-y-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner"><Users className="w-5 h-5 md:w-6 md:h-6" /></div>
            <h3 className="text-base md:text-lg font-bold">Global Community</h3>
            <p className="text-xs text-gray-600 font-medium">Connect with learners from over 120 countries.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl space-y-8 md:space-y-10 border border-gray-100 hover:shadow-[0_32px_80px_-24px_rgba(0,109,91,0.15)] transition-shadow duration-700">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E8F8F2] text-[#006D5B] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner"><KeyRound className="w-6 h-6 md:w-8 md:h-8" /></div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
               {isForgotMode ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest text-[10px]">
               {isForgotMode ? 'Enter your email to receive a reset link.' : 'Enter your details to start your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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

            <Button type="submit" className="w-full py-4 md:py-5 text-base md:text-lg shadow-xl shadow-emerald-100" loading={loading}>
              {isForgotMode ? 'Send Reset Link' : mode === 'login' ? 'Log In' : 'Create Account'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
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
