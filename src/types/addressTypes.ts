export type Address = {
  addressID: number;
  userID: string;
  streetAddress: string;
  houseNumber: number;
  apartmentNumber?: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};
