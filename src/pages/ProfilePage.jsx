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
