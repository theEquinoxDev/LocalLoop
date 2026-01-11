import { motion } from 'framer-motion';
import { MapPin, Clock, User } from 'lucide-react';
import type { Item } from '../../types/item';
import { getCategoryConfig } from '../../types/categories';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { useMapStore } from '../../store/map.store';
import { useAuthStore } from '../../store/auth.store';

type ItemCarouselCardProps = {
  item: Item;
  distance: number | null;
};

export const ItemCarouselCard = ({ item, distance }: ItemCarouselCardProps) => {
  const selectItem = useMapStore((s) => s.selectItem);
  const selectedItemId = useMapStore((s) => s.selectedItemId);
  const currentUser = useAuthStore((s) => s.user);
  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  const isSelected = selectedItemId === item._id;
  const isOwnItem = currentUser && item.owner._id === currentUser._id;

  return (
    <motion.button
      onClick={() => selectItem(item._id)}
      className={`flex-shrink-0 w-64 rounded-xl overflow-hidden transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-xl scale-105'
          : 'shadow-lg hover:shadow-xl'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <div className="bg-white">
        {item.imageUrl && (
          <div className="relative h-32 w-full overflow-hidden bg-slate-100">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            <div
              className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-bold ${
                item.type === 'lost'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {item.type === 'lost' ? 'LOST' : 'FOUND'}
            </div>
            
            {isOwnItem && (
              <div className="absolute top-2 left-2 rounded-full bg-blue-600 text-white px-2 py-1 text-xs font-bold flex items-center gap-1">
                <User size={12} />
                Your Post
              </div>
            )}
          </div>
        )}
        <div className="p-3">
          <div className="flex items-start gap-2 mb-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
              style={{ backgroundColor: `${categoryConfig.color}20` }}
            >
              <Icon size={20} style={{ color: categoryConfig.color }} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600">{categoryConfig.label}</p>
            </div>
          </div>
          <div className="space-y-1">
            {distance !== null && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin size={12} className="text-slate-400" />
                <span>
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} away
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock size={12} className="text-slate-400" />
              <span>{formatDistanceToNow(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
