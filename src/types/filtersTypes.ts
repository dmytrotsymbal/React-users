export type UsersTableFilters = {
  minAge?: number;
  maxAge?: number;
  createdFrom?: string;
  createdTo?: string;
  onlyAdults?: boolean;
  onlyWithPhoto?: boolean;
};

export type CarsTableFilters = {
  minYear?: number;
  maxYear?: number;
  carColor?: string;
  onlyWithPhoto?: boolean;
};
