export enum RoleEnum {
  visitor = "visitor",
  moderator = "moderator",
  admin = "admin",
}

export type Staff = {
  staffID: number;
  nickname: string;
  email: string;
  passwordHash?: number;
  role?: RoleEnum;
  createdAt?: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};
