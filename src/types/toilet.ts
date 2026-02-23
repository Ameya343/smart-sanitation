export type CleanlinessGrade = 'A' | 'B' | 'C' | 'D';

export type ToiletStatus = 'clean' | 'needs-cleaning' | 'unhygienic';
export type OperationalStatus = 'open' | 'closed' | 'maintenance';

export interface SensorData {
  odorLevel: number; // 0-100
  ammoniaLevel: number; // 0-100
  humidity: number; // 0-100
  usageFrequency: number; // visits per hour
}

export interface ToiletFacility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  grade: CleanlinessGrade;
  hygieneScore: number; // 0-100
  status: ToiletStatus;
  operationalStatus: OperationalStatus;
  userRating: number; // 1-5
  totalReviews: number;
  isAccessible: boolean;
  isFree: boolean;
  lastCleaned: string;
  sensorData: SensorData;
  distance?: number; // km, calculated dynamically
}

export interface FilterOptions {
  grades: CleanlinessGrade[];
  accessibility: boolean | null;
  freeOnly: boolean;
  openOnly: boolean;
}
