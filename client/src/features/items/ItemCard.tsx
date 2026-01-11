import type { Item } from '../../types/item';
import { motion } from 'framer-motion';
import { useMapStore } from '../../store/map.store';
import { getCategoryConfig } from '../../types/categories';
import { Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { calculateDistance } from '../../utils/locationUtils';

export const ItemCard = ({ item }: { item: Item }) => {
  const selectItem = useMapStore((s) => s.selectItem);
  const latitude = useMapStore((s) => s.latitude);
  const longitude = useMapStore((s) => s.longitude);
  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  
  const distance = latitude && longitude
    ? calculateDistance(
        latitude,
        longitude,
        item.location.coordinates[1],
        item.location.coordinates[0]
      )
    : null;

  const timeAgo = formatDistanceToNow(item.createdAt);

  return (
    <motion.div
      onClick={() => selectItem(item._id)}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 hover:shadow-md"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${categoryConfig.color}15` }}
      >
        <Icon size={24} style={{ color: categoryConfig.color }} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              item.type === 'lost'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-0.5">{categoryConfig.label}</p>

        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
          {distance !== null && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} away</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
