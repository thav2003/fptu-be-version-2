import { GetUserRegisterDTO, GetUserLoginDTO } from '@dto/authDTO';
import { UserDocument } from '@models';
import { NormalizedUserDocument } from '@utils/normalize';
import { ObjectId } from 'mongodb';



export interface IAuthService {
  correctPassword(candidatePassword:string, userPassword:string):Promise<boolean>;
  signToken(id:ObjectId):string;
  createRefreshToken(user:NormalizedUserDocument): Promise<string>;
  hashPassword(password:string):Promise<string>;
  verifyExpiration(refreshToken:any):boolean;
  registerUser(data:GetUserRegisterDTO): Promise<UserDocument>;
  findAccount(data:GetUserLoginDTO): Promise<NormalizedUserDocument>;
}