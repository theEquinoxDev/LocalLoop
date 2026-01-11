import { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '../../components/ui/Button';
import { useItemStore } from '../../store/item.store';
import { useMapStore } from '../../store/map.store';
import { Input } from '../../components/ui/Input';
import { MapPin } from 'lucide-react';

type Props = {
  type: 'lost' | 'found';
  formData: {
    title: string;
    description: string;
    category: string;
    expiresAt: string;
    radius: number;
  };
  onClose: () => void;
  onBack: () => void;
};

export const LocationPicker = ({
  type,
  formData,
  onClose,
  onBack,
}: Props) => {
  const addItem = useItemStore((s) => s.addItem);
  const loading = useItemStore((s) => s.loading);
  const { latitude, longitude, postingLocation, setPostingLocation } =
    useMapStore();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapLat, setMapLat] = useState<number | null>(null);
  const [mapLng, setMapLng] = useState<number | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });

  useEffect(() => {
    if (mapLat === null && mapLng === null) {
      if (latitude && longitude) {
        setMapLat(latitude);
        setMapLng(longitude);
        setViewState({ latitude, longitude, zoom: 14 });
      } else if (postingLocation) {
        setMapLat(postingLocation.lat);
        setMapLng(postingLocation.lng);
        setViewState({ latitude: postingLocation.lat, longitude: postingLocation.lng, zoom: 14 });
      }
    }
  }, []);

  const handleMapClick = (e: any) => {
    if (e.lngLat) {
      const { lng, lat } = e.lngLat;
      setMapLat(lat);
      setMapLng(lng);
      setPostingLocation(lat, lng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (latitude && longitude) {
      setMapLat(latitude);
      setMapLng(longitude);
      setPostingLocation(latitude, longitude);
      setViewState({ latitude, longitude, zoom: 14 });
    }
  };

  const submit = async () => {
    try {
      setError(null);

      if (!mapLat || !mapLng) {
        setError('Please click on the map to select a location');
        return;
      }

      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('type', type);
      submitFormData.append('description', formData.description || '');
      submitFormData.append('category', formData.category);
      submitFormData.append('latitude', mapLat.toString());
      submitFormData.append('longitude', mapLng.toString());
      submitFormData.append('radius', formData.radius.toString());
      submitFormData.append('expiresAt', formData.expiresAt);
      if (file) submitFormData.append('image', file);

      await addItem(submitFormData);
      useMapStore.getState().clearPostingLocation();
      onClose();
    } catch (error: any) {
      console.error('Error posting item:', error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to post item. Please try again.'
      );
    }
  };

  if (mapLat === null || mapLng === null) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Click on the map to select location *
          </label>
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-xs px-2 py-1 h-auto"
          >
            Use My Location
          </Button>
        </div>
        <div 
          className="relative h-64 w-full overflow-hidden rounded-md border border-slate-300"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            onClick={handleMapClick}
            onDblClick={(e) => {
              handleMapClick(e);
            }}
            interactive={true}
            cursor="crosshair"
            style={{ width: '100%', height: '100%' }}
          >
            {mapLat !== null && mapLng !== null && (
              <Marker 
                latitude={mapLat} 
                longitude={mapLng}
                draggable={true}
                onDrag={(e) => {
                  setMapLat(e.lngLat.lat);
                  setMapLng(e.lngLat.lng);
                }}
                onDragEnd={(e) => {
                  const newLat = e.lngLat.lat;
                  const newLng = e.lngLat.lng;
                  setMapLat(newLat);
                  setMapLng(newLng);
                  setPostingLocation(newLat, newLng);
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg border-2 border-white cursor-move">
                  <MapPin size={20} />
                </div>
              </Marker>
            )}
          </Map>
        </div>
        {mapLat !== null && mapLng !== null && (
          <p className="mt-1 text-xs text-slate-500">
            Selected: {mapLat.toFixed(6)}, {mapLng.toFixed(6)} (Drag marker to adjust)
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Upload Image (Optional)
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="mt-1 text-xs text-slate-500">
            Selected: {file.name}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={submit}
          className="flex-1"
          disabled={loading || !mapLat || !mapLng}
        >
          {loading ? 'Posting...' : 'Post Item'}
        </Button>
      </div>
    </div>
  );
};
