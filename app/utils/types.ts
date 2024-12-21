// app/utils/types.ts
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthResponse {
  message: string;
  user?: Omit<User, 'password'>;
}
