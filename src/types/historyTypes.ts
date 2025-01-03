export type History = {
  searchID: number;
  staffID: number;
  searchQuery: string;
  searchFilters?: string;
  searchType: SearchType;
  searchDate: string;
};

export enum SearchType {
  users = "users",
  cars = "cars",
}
