import { create } from 'zustand';

type MapState = {
  latitude: number | null;
  longitude: number | null;
  zoom: number;
  selectedItemId: string | null;
  postingLocation: { lat: number; lng: number } | null;
  animationComplete: boolean;
  mapStyle: 'dark' | 'satellite';
  setLocation: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  selectItem: (id: string | null) => void;
  setPostingLocation: (lat: number, lng: number) => void;
  clearPostingLocation: () => void;
  setAnimationComplete: (complete: boolean) => void;
  toggleMapStyle: () => void;
};

export const useMapStore = create<MapState>((set) => ({
  latitude: null,
  longitude: null,
  zoom: 15.5,
  selectedItemId: null,
  postingLocation: null,
  animationComplete: false,
  mapStyle: 'dark',

  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  setZoom: (zoom) => set({ zoom }),
  selectItem: (id) => set({ selectedItemId: id, animationComplete: false }),
  setPostingLocation: (lat, lng) => set({ postingLocation: { lat, lng } }),
  clearPostingLocation: () => set({ postingLocation: null }),
  setAnimationComplete: (complete) => set({ animationComplete: complete }),
  toggleMapStyle: () => set((state) => ({ mapStyle: state.mapStyle === 'dark' ? 'satellite' : 'dark' })),
}));
