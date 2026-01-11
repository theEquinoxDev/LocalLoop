import api from './api';
import type { Item } from '../types/item';

export const createItem = async (formData: FormData) => {
  const { data } = await api.post<Item>('/api/items', formData);
  return data;
};

export const getNearbyItems = async (
  lat: number,
  lng: number,
  radius: number
) => {
  const { data } = await api.get<Item[]>('/api/items/nearby', {
    params: { lat, lng, radius },
  });
  return data;
};

export const getItemById = async (id: string) => {
  const { data } = await api.get<Item>(`/api/items/${id}`);
  return data;
};

export const resolveItem = async (id: string) => {
  const { data } = await api.patch<{ message: string }>(
    `/api/items/${id}/resolve`
  );
  return data;
};

export const claimItem = async (id: string) => {
  const { data } = await api.patch<Item>(`/api/items/${id}/claim`);
  return data;
};
