import { inject, injectable } from 'inversify';
import * as bcrypt from 'bcrypt';
import { TYPES } from '@src/types';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDocument, UserDocument } from '@models';
import { GetUserLoginDTO, GetUserRegisterDTO } from '@dto/authDTO';
import { BadRequestError } from '@src/errors/app.errors';
import StaticStringKeys from '@src/constants';
import { getValidObjectId } from '@utils/utils';
import container from '@src/injector';
import { IAuthService } from '@services/Interface';
import { IRefreshTokenRepository, IUserRepository } from '@repository/Interface';
import { ObjectId } from 'mongodb';
import { NormalizedUserDocument } from '@utils/normalize';






@injectable()
export class AuthService implements IAuthService {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;


  async findAccount(data:GetUserLoginDTO): Promise<NormalizedUserDocument> {
    const users = await this.userRepository.find({
      email:data.email,
    }, 1);
    if (!users[0]) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    } else if (!(await this.correctPassword(data.password, users[0].password))) {
      throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    }
   
    users[0].password = undefined;
    users[0].passwordConfirm = undefined;
    return users[0];
  }

  async registerUser(data: GetUserRegisterDTO): Promise<UserDocument> {
    const users = await this.userRepository.find({
      email:data.email,
    }, 1);
    if (users[0]) {
      throw new BadRequestError(StaticStringKeys.EMAIL_ALREADY_EXIST);
    }
    data.password = await this.hashPassword(data.password);
    const createData = data as UserDocument;
    const created = await this.userRepository.create(createData);
    const user = await this.userRepository.get(getValidObjectId(created.insertedId));
    return user;
  }
    
  verifyExpiration(refreshToken:any) {
    return refreshToken.expiryDate.getTime() < new Date().getTime();
  }

  async createRefreshToken(user:NormalizedUserDocument):Promise<string> {
    const refreshTokenRepository = container.get<IRefreshTokenRepository>(TYPES.RefreshTokenRepository);
    const expiredAt = new Date();
    expiredAt.setSeconds(
      expiredAt.getSeconds() + Number(process.env.REFRESH_TOKEN_EXPIRETIME),
    );
        
    const token = uuidv4();            
    const refreshToken = {
      token: token,
      userId: user?._id,
      expiryDate: expiredAt,
    } as RefreshTokenDocument;
    await refreshTokenRepository.create(refreshToken);
    return refreshToken.token;
  }

  signToken(id: ObjectId) {
    return jwt.sign({ userId:id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.SERVER_TOKEN_EXPRIRETIME),
    });
  }

  async hashPassword(password: string): Promise<string> {
    const normalizePassword = password.trim();
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(normalizePassword, salt);
    return hash;
  }

  async correctPassword(candidatePassword:string, userPassword:string) {
    return bcrypt.compare(candidatePassword, userPassword);
  }
    
}