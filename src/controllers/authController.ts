import {   Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { inject, injectable } from 'inversify';
import { BadRequestError, InvalidTokenError, MissingFieldError } from '@src/errors/app.errors';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import StaticStringKeys from '@src/constants';
import { GetUserLoginDTO, GetUserRegisterDTO } from '@dto/authDTO';
import { TYPES } from '@src/types';
import Email from '@utils/email';
import { IAuthService } from '@services/Interface';
import { IRefreshTokenRepository } from '@repository/Interface';



@injectable()
export class AuthController {

  @inject(TYPES.AuthService) private authService: IAuthService;

  @inject(TYPES.RefreshTokenRepository) private refreshTokenRepository: IRefreshTokenRepository;
    
  //   constructor() {
  //   }
    
  /**
     * refresh
     *
     * @requires refreshton 
    **/
  public async refresh(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const { refreshToken } = req.cookies;
    if (refreshToken == null) {
      throw new InvalidTokenError('REFRESH');
    }

    const checkRefreshToken = await this.refreshTokenRepository.findOne({ token:refreshToken });
    if (this.authService.verifyExpiration(checkRefreshToken)) {
      await this.refreshTokenRepository.remove({ token:checkRefreshToken }, false);
      throw new BadRequestError(StaticStringKeys.EXPIRED_TOKEN);
    }
    let token = await this.authService.signToken(checkRefreshToken.userId);
    res.send({ accessToken:token });
  }

  /**
     * login
     *
     * @requires password A valid password
     * @requires email A valid email
    **/
  public async login(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.body.email) {
      throw new MissingFieldError('email');
    }
    if (!req.body.password) {
      throw new MissingFieldError('password');
    }
    if (!isEmail(req.body.email)) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    }
      
    if (!isLength(req.body.password.trim(), { min: 4, max: 20 })) {
      throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    }
    const getUserDTO: GetUserLoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await this.authService.findAccount(getUserDTO);

    //**generate refresh token for the user  */
    const refreshToken = await this.authService.createRefreshToken(user);
    const token = this.authService.signToken(user._id);


    const cookieOptions = {
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN)  * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.send({ ...user, accessToken:token });
  }


  /**
     * register
     *
     * @requires password A valid password
     * @requires email A valid email
    **/
  public async register(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.body.username) {
      throw new MissingFieldError('username');
    }
    if (!req.body.email) {
      throw new MissingFieldError('email');
    }
    if (!req.body.password) {
      throw new MissingFieldError('password');
    }
    if (!req.body.passwordConfirm) {
      throw new MissingFieldError('confirmPassword');
    }
    if (!isEmail(req.body.email)) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    }
      
    if (!isLength(req.body.password.trim(), { min: 4, max: 20 })) {
      throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    }
    const getUserDTO: GetUserRegisterDTO = {
      name: req.body.name,
      email: req.body.email,
      role:'user',
      password: req.body.password,
      passwordConfirm:req.body.passwordConfirm,
    };
    const user = await this.authService.registerUser(getUserDTO);
    const token = this.authService.signToken(user._id);
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify/${user._id}/${token}`;
    await new Email(user).sendVerify(url);
    res.sendStatus(201);
  }

  public async find(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new BadRequestError('Method not implemented.');
  }

  public async get(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new BadRequestError('Method not implemented.');
  }
    
  public async create(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new BadRequestError('Method not implemented.');
  }

  public async update(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new BadRequestError('Method not implemented.');
  }
    
  public async delete(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new BadRequestError('Method not implemented.');
  }
 
}