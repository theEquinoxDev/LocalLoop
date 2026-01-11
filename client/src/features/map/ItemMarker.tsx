import { Marker } from 'react-map-gl';
import { motion } from 'framer-motion';
import type { Item } from '../../types/item';
import { useMapStore } from '../../store/map.store';
import { useAuthStore } from '../../store/auth.store';
import { getCategoryConfig } from '../../types/categories';

export const ItemMarker = ({ item }: { item: Item }) => {
  const selectItem = useMapStore((s) => s.selectItem);
  const selectedItemId = useMapStore((s) => s.selectedItemId);
  const currentUser = useAuthStore((s) => s.user);
  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  const isSelected = selectedItemId === item._id;
  const isUrgent = categoryConfig.urgency === 'high';
  
  const ownerId = typeof item.owner === 'string' ? item.owner : (item.owner?._id || null);
  const isOwnItem = currentUser && ownerId && ownerId === currentUser._id;

  return (
    <Marker
      latitude={item.location.coordinates[1]}
      longitude={item.location.coordinates[0]}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        selectItem(item._id);
      }}
    >
      <motion.div
        className="relative cursor-pointer"
        animate={{
          scale: isSelected ? 1.2 : 1,
          y: isSelected ? -5 : 0,
        }}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isUrgent && (
          <div
            className="absolute inset-0 rounded-full blur-md animate-pulse"
            style={{
              backgroundColor: categoryConfig.color,
              opacity: 0.4,
              transform: 'scale(1.5)',
            }}
          />
        )}

        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg border-2 ${
            isOwnItem ? 'border-slate-400' : 'border-white'
          }`}
          style={{
            backgroundColor: isOwnItem ? '#64748b' : categoryConfig.color,
          }}
        >
          <Icon size={20} className="text-white" strokeWidth={2.5} />
        </div>

        <div
          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${
            item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <span className="text-white">{item.type === 'lost' ? 'L' : 'F'}</span>
        </div>
        
        {isOwnItem && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-white px-2 py-0.5 rounded text-[9px] font-medium shadow-sm opacity-80">
            Your Post
          </div>
        )}
      </motion.div>
    </Marker>
  );
};
