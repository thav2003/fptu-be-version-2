import {  Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from '@models';
import { BadRequestError, UnauthorizedError } from '@src/errors/app.errors';

import { getValidObjectId } from '@utils/utils';
import container from '@src/injector';
import { IUserRepository } from '@repository/Interface';
import { TYPES } from '@src/types';

export interface CustomRequest extends ExpressRequest {
  token: string | jwt.JwtPayload;
}

export interface CustomResponse extends ExpressResponse {
  token:string | jwt.JwtPayload;
  locals:{
    user:UserDocument
  }
}
export default async function checkJwt(req: CustomRequest, res: CustomResponse, next: NextFunction):Promise<void> {
  // 1) Getting token and check of it's there
  let token = req.headers.authorization?.split(' ')[1];
  if (!token)   throw new UnauthorizedError('You are not logged in! Please log in to get access.');

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

  // 3) Check if user still exists
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  let user: UserDocument;
  user = await userRepository.get(getValidObjectId(decoded.userId));
  if (!user) {
    throw new BadRequestError('The user belonging to this token does no longer exist.');
  }
       
  // GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = user;
  next();
}