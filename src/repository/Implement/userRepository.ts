import { injectable } from 'inversify';
import { UserDocument } from '@models';
import Repository from '@core/repository/repository';
import { IUserRepository } from '@repository/Interface';

/**
 * User repository. In the constructor we pass the collection name to the
 * parent constructor.
 *
 */
@injectable()
export class UserRepository extends Repository<UserDocument> implements IUserRepository {
  constructor() {
    super('users'); // Passing collection name
  }

  public async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.find({ username }, 1, 0, { _id : 1 });
    if (user.length > 0) {
      return true;
    }

    return false;
  }

  public async isEmailExists(email: string): Promise<boolean> {
    const user = await this.find({ email }, 1, 0, { _id : 1 });
    if (user.length > 0) {
      return true;
    }

    return false;
  }
}