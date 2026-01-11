import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Award,
  CheckCircle,
  Package,
  Target,
  Check
} from 'lucide-react';
import { getRankTitle } from '../utils/gamification';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    navigate('/login');
    return null;
  }

  const rankTitle = getRankTitle(user.level);
  const currentLevelPoints = user.points % 500;
  const progressPercent = (currentLevelPoints / 500) * 100;
  const pointsToNextLevel = 500 - currentLevelPoints;
  
  const achievements = [
    { 
      icon: Package, 
      title: 'First Post', 
      description: 'Posted a found item',
      unlocked: user.itemsPosted >= 1,
      color: 'blue'
    },
    { 
      icon: CheckCircle, 
      title: 'Reunited', 
      description: 'Claimed your lost item',
      unlocked: user.itemsClaimed >= 1,
      color: 'green'
    },
    { 
      icon: Award, 
      title: 'Good Samaritan', 
      description: 'Returned an item to its owner',
      unlocked: user.itemsReturned >= 1,
      color: 'yellow'
    },
    { 
      icon: Target, 
      title: 'Lucky Finder', 
      description: 'Claimed 5 lost items',
      unlocked: user.itemsClaimed >= 5,
      color: 'purple'
    },
    { 
      icon: Trophy, 
      title: 'Level 5', 
      description: 'Reached level 5',
      unlocked: user.level >= 5,
      color: 'orange'
    },
    { 
      icon: Star, 
      title: 'Legend', 
      description: 'Reached level 20',
      unlocked: user.level >= 20,
      color: 'pink'
    },
  ];

  const getRankColor = (level: number): string => {
    if (level >= 20) return 'from-purple-500 to-pink-500';
    if (level >= 15) return 'from-yellow-500 to-orange-500';
    if (level >= 10) return 'from-blue-500 to-cyan-500';
    if (level >= 5) return 'from-green-500 to-emerald-500';
    return 'from-slate-400 to-slate-500';
  };

  const getAchievementColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Map
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${getRankColor(user.level)}`} />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-16">
              <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${getRankColor(user.level)} flex items-center justify-center border-4 border-white shadow-xl`}>
                <Trophy size={40} className="text-white" />
              </div>
              <div className="pb-2 flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-slate-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Level {user.level}</h2>
              <p className="text-lg text-slate-600">{rankTitle}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-600">
                <Star size={20} className="fill-yellow-500" />
                <span className="text-2xl font-bold">{user.points}</span>
              </div>
              <p className="text-sm text-slate-500">{pointsToNextLevel} to next level</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getRankColor(user.level)} transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              {currentLevelPoints} / 500 XP
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-2">
              <Package size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{user.itemsPosted}</div>
            <div className="text-xs text-slate-600">Items Posted</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{user.itemsClaimed}</div>
            <div className="text-xs text-slate-600">Items Claimed</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mx-auto mb-2">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{user.itemsReturned}</div>
            <div className="text-xs text-slate-600">Items Returned</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award size={24} />
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`rounded-xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-white to-slate-50 shadow-md'
                    : 'bg-slate-100 opacity-50'
                }`}
              >
                <div className={`flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-2 ${
                  achievement.unlocked ? getAchievementColor(achievement.color) : 'bg-slate-300'
                }`}>
                  <achievement.icon size={24} className="text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{achievement.title}</div>
                <div className="text-xs text-slate-600 mt-1">{achievement.description}</div>
                {achievement.unlocked && (
                  <div className="mt-2 text-xs font-medium text-green-600 flex items-center justify-center gap-1">
                    <Check size={12} />
                    Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
