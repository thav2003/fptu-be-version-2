import { UserDocument } from '@models';
import { ObjectId, Filter } from 'mongodb';


export interface UserGetDTO {
  limit: number;
  pageNumber: number;
  filter: Filter<Partial<UserDocument>>;
  path: string;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdatePasswordDTO {
  id: ObjectId;
  password: string;
}

export interface UserUpdateEmailDTO {
  id: ObjectId;
  newEmail: string;
}