import { motion, AnimatePresence } from 'framer-motion';
import { useItemStore } from '../../store/item.store';
import { useMapStore } from '../../store/map.store';
import { useAuthStore } from '../../store/auth.store';
import { getCategoryConfig } from '../../types/categories';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { calculateDistance } from '../../utils/locationUtils';
import { X, MapPin, Clock, User, Mail, Phone, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const ItemsSidebar = ({ searchQuery }: { searchQuery: string }) => {
  const allItems = useItemStore((s) => s.items);
  
  const items = allItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const categoryConfig = getCategoryConfig(item.category);
    return (
      item.description?.toLowerCase().includes(query) ||
      categoryConfig.label.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  });
  const selectedItemId = useMapStore((s) => s.selectedItemId);
  const selectItem = useMapStore((s) => s.selectItem);
  const latitude = useMapStore((s) => s.latitude);
  const longitude = useMapStore((s) => s.longitude);
  const currentUser = useAuthStore((s) => s.user);
  const resolve = useItemStore((s) => s.markResolved);
  const claim = useItemStore((s) => s.claimItem);

  const userLocation = latitude && longitude ? { latitude, longitude } : null;

  const selectedItem = items.find(item => item._id === selectedItemId);

  const handleClaim = async (itemId: string) => {
    try {
      await claim(itemId);
      toast.success('Item claimed successfully!');
      console.log('Item claimed, store should update automatically');
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim item');
    }
  };

  const handleResolve = async (itemId: string) => {
    try {
      await resolve(itemId);
      toast.success('Item marked as resolved!');
      selectItem(null);
    } catch (error) {
      toast.error('Failed to resolve item');
    }
  };

  return (
    <div className="w-72 bg-white shadow-xl flex flex-col border-r border-slate-200">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Nearby Items
        </h2>
        <p className="text-sm text-slate-600 mt-1">{items.length} items found</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <button
                onClick={() => selectItem(null)}
                className="mb-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
              >
                <X size={16} />
                Back to list
              </button>

              <ItemDetails
                key={selectedItem._id}
                item={selectedItem}
                userLocation={userLocation}
                currentUser={currentUser}
                onClaim={handleClaim}
                onResolve={handleResolve}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-slate-100"
            >
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  userLocation={userLocation}
                  onClick={() => selectItem(item._id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ItemCard = ({ item, userLocation, onClick }: any) => {
  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  const timeAgo = formatDistanceToNow(item.createdAt);
  
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.location.coordinates[1],
        item.location.coordinates[0]
      )
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: `${categoryConfig.color}20` }}
        >
          <Icon size={20} style={{ color: categoryConfig.color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">
              {categoryConfig.label}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                item.type === 'lost'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </span>
          </div>
          
          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
            {item.description}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {distance !== null && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const ItemDetails = ({ item, userLocation, currentUser, onClaim, onResolve }: any) => {
  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  const timeAgo = formatDistanceToNow(item.createdAt);
  
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.location.coordinates[1],
        item.location.coordinates[0]
      )
    : null;

  const isOwner = currentUser && item.owner?._id === currentUser._id;
  const isClaimer = currentUser && item.claimer?._id === currentUser._id;

  console.log('ItemDetails render:', {
    hasClaimer: !!item.claimer,
    isOwner,
    isClaimer,
    isResolved: item.isResolved,
    itemType: item.type,
    claimerData: item.claimer
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${categoryConfig.color}20` }}
        >
          <Icon size={24} style={{ color: categoryConfig.color }} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{categoryConfig.label}</h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              item.type === 'lost'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>
      </div>

      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={categoryConfig.label}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Description</h4>
        <p className="text-sm text-slate-600">{item.description}</p>
      </div>

      <div className="space-y-2 text-sm">
        {distance !== null && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={16} className="text-blue-500" />
            <span>
              {distance < 1 ? `${Math.round(distance * 1000)} meters` : `${distance.toFixed(1)} km`} away
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={16} className="text-slate-400" />
          <span>{timeAgo}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <User size={16} className="text-slate-400" />
          <span>Posted by {typeof item.owner === 'string' ? 'Unknown' : item.owner?.name || 'Unknown'}</span>
        </div>
      </div>

      {!item.claimer && !item.isResolved && !isOwner && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">Contact Finder</h4>
          {typeof item.owner !== 'string' && item.owner?.email && (
            <a
              href={`mailto:${item.owner.email}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Mail size={16} />
              {item.owner.email}
            </a>
          )}
          {typeof item.owner !== 'string' && item.owner?.phone && (
            <a
              href={`tel:${item.owner.phone}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Phone size={16} />
              {item.owner.phone}
            </a>
          )}
        </div>
      )}

      {item.type === 'found' && !item.claimer && !item.isResolved && currentUser && !isOwner && (
        <Button
          onClick={() => onClaim(item._id)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <CheckCircle size={18} />
          This is Mine - Claim It
        </Button>
      )}

      {item.claimer && !item.isResolved && (
        <div className="space-y-2">
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {isClaimer 
              ? 'You claimed this item! The finder can see your contact details and will help you get it back.'
              : isOwner
              ? 'Someone claimed this item! Contact them to arrange the return.'
              : 'This item has been claimed.'}
          </div>
          {isClaimer && item.owner && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Finder Contact</h4>
              <div className="text-sm text-slate-600 mb-2">
                <User size={14} className="inline mr-1" />
                {typeof item.owner !== 'string' ? item.owner.name : 'Unknown'}
              </div>
              {typeof item.owner !== 'string' && item.owner?.phone && (
                <div className="flex gap-2">
                  <a
                    href={`tel:${item.owner.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${item.owner.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}
          {isOwner && item.claimer && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Claimer Contact</h4>
              <div className="text-sm text-slate-600 mb-2">
                <User size={14} className="inline mr-1" />
                {typeof item.claimer !== 'string' ? item.claimer.name : 'Unknown'}
              </div>
              {typeof item.claimer !== 'string' && item.claimer?.phone && (
                <div className="flex gap-2">
                  <a
                    href={`tel:${item.claimer.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${item.claimer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}
          
          {isOwner && (
            <Button
              onClick={() => onResolve(item._id)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle size={18} />
              Confirm Item Returned
            </Button>
          )}
          {isClaimer && (
            <Button
              onClick={() => onResolve(item._id)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle size={18} />
              Confirm Item Received
            </Button>
          )}
        </div>
      )}

      {item.isResolved && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle size={18} />
          This item has been successfully returned!
        </div>
      )}
    </div>
  );
};


