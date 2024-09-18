export type Resident = {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  moveInDate: string;
  moveOutDate?: string | null;
};
