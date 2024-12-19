import { Photo } from "./photoTypes";

export type User = {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  photos: Photo[];
};

export type UserDTO = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
};

export type UserSearchFilters = {
  minAge?: number;
  maxAge?: number;
  createdFrom?: string;
  createdTo?: string;
  onlyAdults?: boolean;
};
