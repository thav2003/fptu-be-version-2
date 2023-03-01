import { injectable, inject } from 'inversify';
import paginate, { Pagination } from '@utils/pagination';
import { UserGetDTO } from '@dto/userDTO';
import { RawConfessionCreateDTO } from '@dto/rawConfessionDTO';
import { TYPES } from '@src/types';
import { UserDocument } from '@models';
import { Select } from '@core/repository/ISelect';

import { IUserService } from '@services/Interface';
import { IUserRepository, IRawConfessionRepository } from '@repository/Interface';





/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
@injectable()
export class UserService implements IUserService {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;

  @inject(TYPES.RawConfessionRepository) private rawConfessionRepository: IRawConfessionRepository;

  public async createConfession(data: RawConfessionCreateDTO): Promise<void> {
    await this.rawConfessionRepository.create(data);
  }

  public async getAllUsers(getUserDto: UserGetDTO): Promise<Pagination<UserDocument>> {
    let documents: UserDocument[];
    const select:Select = {
      password:0,
      passwordConfirm:0,
    };

    const filter = getUserDto.filter || {};
    documents = await this.userRepository.find(filter, getUserDto.limit, getUserDto.pageNumber, select);
    const totalRecord = await this.userRepository.countAll(filter);
    return paginate(documents, getUserDto.limit, getUserDto.pageNumber, totalRecord, getUserDto.path);
  }

 

}