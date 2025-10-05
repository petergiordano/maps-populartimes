export interface DayData {
  name: string;
  data: number[]; // 24 hourly values (0-100)
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  formatted_address: string;
  type: 'public' | 'private';
  location: string;
  lat: number;
  lng: number;
  place_id: string;
  rating?: number;
  rating_n?: number;
  current_popularity?: number;
  time_spent?: number[];
  populartimes: DayData[];
  has_popular_times: boolean;
  fetched_at: string;
}

export interface FacilityWithVisibility extends Facility {
  visible: boolean;
}

export type SortOption = 'name' | 'rating' | 'type' | 'location';
export type SortDirection = 'asc' | 'desc';
