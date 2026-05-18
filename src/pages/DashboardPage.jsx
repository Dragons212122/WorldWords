import React from 'react';
import { Trophy, Flame, Bookmark, BookOpen, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TOPICS, WORDS_BY_TOPIC } from '../data/topics';

export const DashboardPage = ({ profile, learnedWords, bookmarks, selectTopic, setCurrentPage }) => {
  const totalLearned = Object.values(learnedWords).reduce((acc, topicWords) => acc + Object.keys(topicWords).length, 0);
  const totalBookmarks = bookmarks.length;
  const totalXP = profile?.xp || 0;
  
  // Find started topics
  const startedTopics = TOPICS.filter(t => learnedWords[t.id] && Object.keys(learnedWords[t.id]).length > 0);

  return (
    <div className="py-24 px-6 lg:px-24 bg-[#F8F9FF] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Welcome back, <span className="text-[#006D5B]">{profile?.name || "Scholar"}</span>!</h1>
            <p className="text-xl text-gray-500 font-medium mt-2">Ready to conquer more vocabulary today?</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full"><Flame className="w-6 h-6 text-amber-500" /></div>
            <div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Streak</div>
              <div className="text-2xl font-black text-gray-900">{profile?.streak || 0} Days</div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><CheckCircle2 className="w-7 h-7" /></div>
            <div className="text-5xl font-black text-gray-900 mb-2">{totalLearned}</div>
            <div className="text-gray-500 font-bold">Words Mastered</div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6"><Bookmark className="w-7 h-7" /></div>
            <div className="text-5xl font-black text-gray-900 mb-2">{totalBookmarks}</div>
            <div className="text-gray-500 font-bold">Saved Words</div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Trophy className="w-7 h-7" /></div>
            <div className="text-5xl font-black text-gray-900 mb-2">{totalXP}</div>
            <div className="text-gray-500 font-bold">Total XP</div>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Progress */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Your Progress</h2>
            {startedTopics.length === 0 ? (
              <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"><BookOpen className="w-8 h-8 text-gray-400" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No topics started yet</h3>
                <p className="text-gray-500 mb-6">Head over to the catalog to begin your journey.</p>
                <Button onClick={() => setCurrentPage('catalog')} className="rounded-3xl px-8 py-4 bg-[#006D5B] text-white hover:bg-[#005244] border-0">Explore Topics</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {startedTopics.map(t => {
                  const learnedInTopic = Object.keys(learnedWords[t.id] || {}).length;
                  const totalInTopic = WORDS_BY_TOPIC[t.id]?.length || 0;
                  const progress = totalInTopic > 0 ? (learnedInTopic / totalInTopic) * 100 : 0;
                  return (
                    <div key={t.id} onClick={() => selectTopic(t.id)} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#006D5B] cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
                      <img src={t.img} alt={t.title} className="w-24 h-24 rounded-2xl object-cover" />
                      <div className="flex-1 w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-bold text-[#006D5B]">{learnedInTopic} / {totalInTopic} words</span>
                          <span className="text-gray-400 font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#006D5B] h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <Button variant="ghost" className="rounded-full bg-gray-50 text-[#006D5B] shrink-0 p-3"><ArrowRight className="w-5 h-5" /></Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Center */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Quick Actions</h2>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <button onClick={() => setCurrentPage('catalog')} className="w-full p-4 rounded-2xl bg-[#006D5B] text-white font-bold flex items-center justify-between hover:bg-[#005244] transition-all group">
                <div className="flex items-center gap-3"><BookOpen className="w-5 h-5" /> Browse Catalog</div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setCurrentPage('profile')} className="w-full p-4 rounded-2xl bg-gray-50 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100 transition-all group">
                <div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /> View Profile</div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
