export type History = {
  searchID: number;
  nickname: string;
  email: string;
  role: string;
  searchQuery: string;
  searchFilters?: string;
  searchType: SearchType;
  searchDate: string;
};

export enum SearchType {
  users = "users",
  cars = "cars",
}
