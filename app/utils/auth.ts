//app/utils/auth.ts
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}