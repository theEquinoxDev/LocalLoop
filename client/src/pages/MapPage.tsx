import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../features/map/MapView';
import { PostItemModal } from '../features/post-item/PostItemModal';
import { ItemsSidebar } from '../components/layout/ItemsSidebar';
import { useAuthStore } from '../store/auth.store';
import { useMapStore } from '../store/map.store';
import { Button } from '../components/ui/Button';
import { UserStatsBadge } from '../components/feedback/UserStatsBadge';
import { LogOut, Layers, Search } from 'lucide-react';

export const MapPage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const mapStyle = useMapStore((s) => s.mapStyle);
  const toggleMapStyle = useMapStore((s) => s.toggleMapStyle);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative h-screen w-full bg-slate-50">
      <header className="absolute left-0 right-0 top-0 z-50 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-72 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
          </div>

          <div className="flex-1 flex items-center justify-center px-8">
            {token && (
              <div className="relative w-full max-w-sm">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token && user ? (
              <>
                <button
                  onClick={toggleMapStyle}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                >
                  <Layers size={16} />
                  {mapStyle === 'dark' ? 'Satellite' : 'Dark'}
                </button>
                
                <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
                  <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                  <UserStatsBadge user={user} onClick={() => navigate('/profile')} />
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="pt-20 h-full flex">
        <ItemsSidebar searchQuery={searchQuery} />
        <div className="flex-1">
          <MapView />
        </div>
      </div>

      {token && (
        <div className="absolute bottom-6 right-6 z-10">
          <PostItemModal />
        </div>
      )}
    </div>
  );
};