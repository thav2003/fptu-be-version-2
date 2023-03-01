import { UserDocument } from '@models';
import { IRepository } from '@core/repository/IRepository';


export interface IUserRepository extends IRepository<UserDocument> {
  isUsernameExists(username: string): Promise<boolean>;
  isEmailExists(username: string): Promise<boolean>;
}
  