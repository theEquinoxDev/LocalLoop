import { useEffect, useState } from 'react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { useItemStore } from '../../store/item.store';
import { useMapStore } from '../../store/map.store';
import { useAuthStore } from '../../store/auth.store';
import { getCategoryConfig } from '../../types/categories';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { calculateDistance } from '../../utils/locationUtils';
import { MapPin, Clock, User, Calendar, Flame, Mail, CheckCircle, Phone, MessageCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const ItemDetailsSheet = () => {
  const item = useItemStore((s) => s.activeItem);
  const fetchItem = useItemStore((s) => s.fetchItem);
  const clearActiveItem = useItemStore((s) => s.clearActiveItem);
  const resolve = useItemStore((s) => s.markResolved);
  const claim = useItemStore((s) => s.claimItem);
  const loading = useItemStore((s) => s.loading);
  const selectedItemId = useMapStore((s) => s.selectedItemId);
  const animationComplete = useMapStore((s) => s.animationComplete);
  const selectItem = useMapStore((s) => s.selectItem);
  const latitude = useMapStore((s) => s.latitude);
  const longitude = useMapStore((s) => s.longitude);
  const currentUser = useAuthStore((s) => s.user);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (selectedItemId) {
      fetchItem(selectedItemId);
    } else {
      clearActiveItem();
    }
  }, [selectedItemId, fetchItem, clearActiveItem]);

  if (!item) return null;

  const categoryConfig = getCategoryConfig(item.category);
  const Icon = categoryConfig.icon;
  const isUrgent = categoryConfig.urgency === 'high';
  const timeAgo = formatDistanceToNow(item.createdAt);
  
  const distance = latitude && longitude
    ? calculateDistance(
        latitude,
        longitude,
        item.location.coordinates[1],
        item.location.coordinates[0]
      )
    : null;

  const handleClose = () => {
    selectItem(null);
  };

  const handleResolve = async () => {
    try {
      await resolve(item._id);
      toast.success('Item marked as returned! Great job!');
      selectItem(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to resolve item');
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claim(item._id);
      toast.success('✅ Claim submitted! The owner can now see your contact info.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to claim item');
    } finally {
      setClaiming(false);
    }
  };

  const isOwner = currentUser && item.owner?._id === currentUser._id;
  const isClaimer = currentUser && item.claimer?._id === currentUser._id;

  return (
    <Sheet open={animationComplete && !!item}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: `${categoryConfig.color}20` }}
            >
              <Icon size={24} style={{ color: categoryConfig.color }} strokeWidth={2} />
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
          {isUrgent && (
            <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1">
              <Flame size={16} className="text-red-600" />
              <span className="text-xs font-semibold text-red-700">URGENT</span>
            </div>
          )}
        </div>

        {item.imageUrl && (
          <div className="relative w-full overflow-hidden rounded-lg bg-slate-100">
            <img
              src={item.imageUrl}
              className="h-auto w-full object-contain"
              alt={item.title}
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
          {item.description && (
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{item.description}</p>
          )}
        </div>

        <div className="space-y-2 rounded-lg bg-slate-50 p-3">
          {distance !== null && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400" />
              <span>
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} away from you
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} className="text-slate-400" />
            <span>Posted {timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span>Expires on {new Date(item.expiresAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User size={16} className="text-slate-400" />
            <span>Posted by {item.owner.name}</span>
          </div>
        </div>

        {item.claimer && (
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">
                  {isOwner ? 'Someone Found Your Item!' : isClaimer ? 'You Claimed This' : 'Already Claimed'}
                </h3>
                <p className="text-sm text-green-700 mb-2">
                  {isOwner 
                    ? `${item.claimer.name} found this item and posted it. Contact them to arrange pickup.` 
                    : isClaimer
                    ? 'You claimed this item. The finder can see your contact details and will help you get it back.'
                    : 'This item has been claimed by its owner.'}
                </p>
                {isOwner && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-green-600" />
                      <span className="font-medium text-green-900">{item.claimer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-green-600" />
                      <a href={`mailto:${item.claimer.email}`} className="text-green-700 hover:underline">
                        {item.claimer.email}
                      </a>
                    </div>
                    {item.claimer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-green-600" />
                        <span className="font-medium text-green-900">{item.claimer.phone}</span>
                      </div>
                    )}
                    {item.claimer.phone && (
                      <div className="flex gap-2 mt-3">
                        <a
                          href={`tel:${item.claimer.phone}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          <Phone size={16} />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${item.claimer.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          <MessageCircle size={16} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {!item.claimer && !isOwner && item.type === 'found' && (
            <Button
              onClick={handleClaim}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              disabled={claiming || item.isResolved}
            >
              {claiming ? 'Claiming...' : (
                <>
                  <CheckCircle size={16} />
                  This is Mine - Claim It
                </>
              )}
            </Button>
          )}

          {isOwner && item.claimer && !item.isResolved && (
            <Button
              onClick={handleResolve}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Confirming...' : (
                <>
                  <Check size={16} />
                  Confirm Item Returned
                </>
              )}
            </Button>
          )}

          {isClaimer && item.claimer && !item.isResolved && (
            <Button
              onClick={handleResolve}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Confirming...' : (
                <>
                  <Check size={16} />
                  Confirm Item Received
                </>
              )}
            </Button>
          )}

          {item.isResolved && (
            <div className="w-full rounded-lg bg-green-100 px-4 py-3 text-center">
              <span className="text-sm font-semibold text-green-800 flex items-center justify-center gap-1">
                <Check size={16} />
                Item Successfully Returned!
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={handleClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </Sheet>
  );
};


