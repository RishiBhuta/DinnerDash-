export interface Restaurant {
  id: string;
  name: string;
  active: boolean; // if false, temporarily disabled from raffle but saved in list
  craving: boolean; // if true, item has double chance/weight
  category?: string; // e.g. "Pizza", "Sushi" presets
  color?: string; // tailwind color prefix, e.g. "orange", "indigo"
  favorite?: boolean; // user has saved this spot as a favorite
  ambience?: string; // e.g. "Fine Dining", "Street Food", "Cozy Cafe", "Casual Dining", "Pub / Bar"
  priceRange?: '₹' | '₹₹' | '₹₹₹'; // Price range filter
  latitude?: number; // Coordinates for Google Maps
  longitude?: number;
  address?: string; // Real location address
  rating?: number; // Google rating (optional)
}

export interface ChoiceHistory {
  id: string;
  restaurantName: string;
  timestamp: number; // UTC timestamp of choice
  vetoed: boolean; // whether this choice was vetoed
}

