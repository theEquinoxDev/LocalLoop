import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, MapPin } from 'lucide-react';
import type { Item } from '../../types/item';
import { ItemCarouselCard } from './ItemCarouselCard';
import { useMapStore } from '../../store/map.store';
import { calculateDistance } from '../../utils/locationUtils';

type ItemCarouselProps = {
  items: Item[];
};

export const ItemCarousel = ({ items }: ItemCarouselProps) => {
  const latitude = useMapStore((s) => s.latitude);
  const longitude = useMapStore((s) => s.longitude);
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-6 pointer-events-none">
      <div className="pointer-events-auto px-4">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="mx-auto flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <MapPin size={18} className="text-blue-600" />
              <span className="font-semibold text-slate-900">
                {items.length} {items.length === 1 ? 'item' : 'items'} nearby
              </span>
              <ChevronUp size={18} className="text-slate-500" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="space-y-3"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="mx-auto flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-sm font-medium text-slate-700">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-3 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                  {items.map((item) => {
                    const distance = latitude && longitude
                      ? calculateDistance(
                          latitude,
                          longitude,
                          item.location.coordinates[1],
                          item.location.coordinates[0]
                        )
                      : null;

                    return (
                      <div key={item._id} style={{ scrollSnapAlign: 'center' }}>
                        <ItemCarouselCard item={item} distance={distance} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
