import { Trophy, Star } from 'lucide-react';
import {type User } from '../../types/user';

type UserStatsBadgeProps = {
  user: User;
  onClick?: () => void;
};

const getRankTitle = (level: number): string => {
  if (level >= 20) return 'Legend';
  if (level >= 15) return 'Master';
  if (level >= 10) return 'Expert';
  if (level >= 5) return 'Helper';
  return 'Beginner';
};

const getRankColor = (level: number): string => {
  if (level >= 20) return 'from-purple-500 to-pink-500';
  if (level >= 15) return 'from-yellow-500 to-orange-500';
  if (level >= 10) return 'from-blue-500 to-cyan-500';
  if (level >= 5) return 'from-green-500 to-emerald-500';
  return 'from-slate-400 to-slate-500';
};

export const UserStatsBadge = ({ user, onClick }: UserStatsBadgeProps) => {
  const level = user.level || 1;
  const points = user.points || 0;
  
  const rankTitle = getRankTitle(level);
  const rankColor = getRankColor(level);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${rankColor}`}>
        <Trophy size={16} className="text-white" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-900">Lv {level}</span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs font-medium text-slate-600">{rankTitle}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={10} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs text-slate-500">{points} pts</span>
        </div>
      </div>
    </button>
  );
};
