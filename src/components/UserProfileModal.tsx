import React, { useState } from 'react';
import { X, User, Mail, Sparkles, LogOut, Check, Flame, Bookmark, History, Edit3 } from 'lucide-react';
import { useAuth, ANIME_AVATARS } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistCount: number;
  historyCount: number;
  onOpenWatchlist: () => void;
  onOpenPremium: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  watchlistCount,
  historyCount,
  onOpenWatchlist,
  onOpenPremium,
}) => {
  const { profile, logout, updateUserProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile?.displayName || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateUserProfile({ displayName: tempName.trim() });
      setIsEditingName(false);
    }
  };

  const handleSelectAvatar = async (url: string) => {
    await updateUserProfile({ avatar: url });
    setShowAvatarPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-[#1E232F] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          
          {/* Avatar with edit button */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#F47521] shadow-xl bg-black">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              aria-label="Avatarni o'zgartirish"
              className="absolute -bottom-1 -right-1 p-1.5 bg-[#F47521] hover:bg-[#FF8533] text-black rounded-lg shadow-md cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-[#191B22] border border-[#232732] text-white px-2 py-1 rounded text-xs focus:outline-hidden focus:border-[#F47521]"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-[#F47521] text-black rounded hover:bg-[#FF8533] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {profile.displayName}
                </h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              {profile.email}
            </p>
          </div>

          {/* Membership Badge */}
          <div className="pt-1">
            {profile.isMegaFan ? (
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>AniRoll Mega Fan VIP</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenPremium();
                }}
                className="px-3 py-1 rounded-full bg-[#1E232F] hover:bg-[#F47521]/20 border border-[#232732] hover:border-[#F47521] text-xs font-semibold text-neutral-300 hover:text-[#F47521] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#F47521]" />
                <span>Premium Pass sinash</span>
              </button>
            )}
          </div>

        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="p-3 bg-[#0B0C0E] border border-[#232732] rounded-xl space-y-2">
            <p className="text-xs font-semibold text-neutral-300">
              Yangi anime avatarini tanlang:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ANIME_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.url)}
                  className="aspect-square rounded-lg overflow-hidden border border-[#232732] hover:border-[#F47521] transition-all cursor-pointer"
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenWatchlist();
            }}
            className="p-3 rounded-xl bg-[#191B22] border border-[#232732] hover:border-neutral-600 transition-colors cursor-pointer text-left flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F47521]/15 text-[#F47521] flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Saqlanganlar</p>
              <p className="text-sm font-bold font-mono text-white">{watchlistCount} ta</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenWatchlist();
            }}
            className="p-3 rounded-xl bg-[#191B22] border border-[#232732] hover:border-neutral-600 transition-colors cursor-pointer text-left flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Tomosha tarixi</p>
              <p className="text-sm font-bold font-mono text-white">{historyCount} ta</p>
            </div>
          </button>
        </div>

        {/* Logout action */}
        <div className="pt-2 border-t border-[#232732]">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Tizimdan chiqish (Log Out)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
