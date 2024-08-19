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
