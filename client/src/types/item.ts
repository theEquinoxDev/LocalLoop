export type Item = {
    _id: string;
    title: string;
    description?: string;
    type: 'lost' | 'found';
    category: string;
    imageUrl?: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    radius: number;
    owner: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    claimer?: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    claimedAt?: string;
    isResolved: boolean;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
  