import React, { useState } from 'react';
import { ArrowLeft, Trophy, Flame, Zap, Target, CheckCircle2, Mail, Lock, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ProfilePage = ({ profile, onLogout, onGoHome, onProfileUpdate }) => {
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
    <div className="min-h-screen bg-[#F8F9FF] py-10 md:py-20 px-4 md:px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <button onClick={onGoHome} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8 md:mb-12 font-bold uppercase tracking-widest text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white rounded-[32px] md:rounded-[56px] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006D5B] to-[#0D9488] p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-300 text-[#006D5B] font-black flex items-center justify-center rounded-full text-2xl md:text-4xl border-4 border-white shadow-lg shrink-0">
                {editData.name?.substring(0, 2).toUpperCase() || "JD"}
              </div>
              <div>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-3xl md:text-5xl font-black tracking-tight bg-transparent text-white border-b-2 border-white outline-none mb-2 w-full"
                  />
                ) : (
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight">{editData.name || "Scholar"}</h1>
                )}
                <p className="text-emerald-100 text-sm md:text-lg font-medium mt-1 md:mt-2">{profile?.email || "member@worldwords.com"}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full md:w-auto px-6 py-3 bg-white text-[#006D5B] rounded-xl font-bold hover:bg-emerald-50 transition-all text-center"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-12 space-y-8 md:space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-emerald-50 p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-emerald-100 text-center space-y-2">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-emerald-600 mx-auto" />
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.rank}
                    onChange={(e) => setEditData({...editData, rank: e.target.value})}
                    className="text-xl md:text-3xl font-black text-gray-900 bg-white border border-emerald-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-xl md:text-3xl font-black text-gray-900">{editData.rank}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-blue-100 text-center space-y-2">
                <Flame className="w-8 h-8 md:w-12 md:h-12 text-blue-600 mx-auto" />
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Streak</p>
                {isEditing ? (
                  <input 
                    type="number"
                    value={editData.streak}
                    onChange={(e) => setEditData({...editData, streak: parseInt(e.target.value) || 0})}
                    className="text-xl md:text-3xl font-black text-gray-900 bg-white border border-blue-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-xl md:text-3xl font-black text-gray-900">{editData.streak} days</p>
                )}
              </div>

              <div className="bg-orange-50 p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-orange-100 text-center space-y-2">
                <Zap className="w-8 h-8 md:w-12 md:h-12 text-orange-600 mx-auto" />
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">XP Points</p>
                {isEditing ? (
                  <input 
                    type="number"
                    value={editData.xp}
                    onChange={(e) => setEditData({...editData, xp: parseInt(e.target.value) || 0})}
                    className="text-xl md:text-3xl font-black text-gray-900 bg-white border border-orange-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-xl md:text-3xl font-black text-gray-900">{editData.xp}</p>
                )}
              </div>

              <div className="bg-purple-50 p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-purple-100 text-center space-y-2">
                <Target className="w-8 h-8 md:w-12 md:h-12 text-purple-600 mx-auto" />
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">IELTS Goal</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.goal}
                    onChange={(e) => setEditData({...editData, goal: e.target.value})}
                    className="text-xl md:text-3xl font-black text-gray-900 bg-white border border-purple-200 rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  <p className="text-xl md:text-3xl font-black text-gray-900">{editData.goal}</p>
                )}
              </div>
            </div>

            {/* Learning Path */}
            <div className="border-t border-gray-100 pt-8 md:pt-12 space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Learning Journey</h2>
              <p className="text-sm md:text-base text-gray-400 font-medium">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'recently'}</p>
              <div className="flex gap-3 md:gap-4 flex-wrap">
                {(profile?.recentLessons || []).length > 0 ? (
                  profile.recentLessons.map((lesson, idx) => (
                    <span key={idx} className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs md:text-sm font-bold border border-emerald-200">
                      {lesson}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-300 italic text-sm md:text-base">No lessons completed yet. Start exploring!</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 pt-8 md:pt-12 flex gap-4 flex-col md:flex-row">
              {isEditing ? (
                <>
                  <Button className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-3xl bg-green-600 hover:bg-green-700 w-full" onClick={handleSaveChanges}>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-3xl w-full" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-3xl w-full">
                    <Mail className="w-5 h-5 mr-2" /> Update Email
                  </Button>
                  <Button variant="outline" className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-3xl w-full">
                    <Lock className="w-5 h-5 mr-2" /> Change Password
                  </Button>
                  <Button variant="white" onClick={onLogout} className="flex-1 py-3 md:py-4 text-base md:text-lg rounded-3xl border border-red-200 text-red-600 hover:bg-red-50 w-full">
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
