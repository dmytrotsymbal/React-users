export type Car = {
  carID: number;
  userID: string;
  firm: string;
  model: string;
  color: string;
  year: number;
  licensePlate: string;
  carPhotoURL: string;
};

export type CarSearchFilters = {
  minYear?: number;
  maxYear?: number;
  carColor?: string;
};
