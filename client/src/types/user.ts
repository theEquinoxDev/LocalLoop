export type User = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    points: number;
    level: number;
    itemsPosted: number;
    itemsClaimed: number;
    itemsReturned: number;
    createdAt?: string;
    updatedAt?: string;
  };
  