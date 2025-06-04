
export interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  details: string;
  ref: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  sold: boolean;
  likes: number;
  images?: string[];
}

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type PropertyUpdate = Partial<PropertyInsert>;
