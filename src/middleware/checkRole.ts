import { BadRequestError } from '@src/errors/app.errors';
import {  Request as ExpressRequest, NextFunction } from 'express';
import { CustomResponse } from './checkJwt';


export default function checkRole(roles: Array<string>) {

  return function (_req: ExpressRequest, res: CustomResponse, next: NextFunction) {
      
    //Get the user from previous midleware
    const currentUser = res.locals.user;


    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(currentUser.role) > -1)  next();
    else throw new BadRequestError('You dont have role');
  };
}