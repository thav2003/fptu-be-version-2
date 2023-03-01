import {  inject, injectable } from 'inversify';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import {  MissingFieldError } from '@src/errors/app.errors';
import { UserGetDTO  } from '@dto/userDTO';
import { getValidObjectId } from '@utils/utils';
import { TYPES } from '@src/types';
import { Filter } from 'mongodb';
import { UserDocument } from '@models';
import { IUserService } from '@services/Interface';
import { IUserRepository } from '@repository/Interface';

export enum UserRoles {
  ADMIN = 1,
  MODERATOR = 2,
  VISITOR = 3,
}

@injectable()
export class UserController  {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;

  @inject(TYPES.UserService) private userService: IUserService;

  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async find(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : this.limit;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : 1;
    // console.log(req.originalUrl);
    // console.log(req.baseUrl);
    // console.log(req.path);
    const getUserDto: UserGetDTO = {
      pageNumber,
      limit,
      filter: req.query.filter as Filter<Partial<UserDocument>>,
      path: req.baseUrl,
    };

    const response = await this.userService.getAllUsers(getUserDto);
    res.send(response);
  }

  public async get(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const user = await this.userRepository.get(getValidObjectId(req.params.id));
    res.send(user);
  }
}