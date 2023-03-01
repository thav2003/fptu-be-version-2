import { Pagination } from '@utils/pagination';
import { RawConfessionCreateDTO } from '@dto/rawConfessionDTO';
import { UserGetDTO } from '@dto/userDTO';
import { UserDocument } from '@models';




/**
 * Interface for UserService
 */
export interface IUserService {
  createConfession(data: RawConfessionCreateDTO): Promise<void>;
  getAllUsers(data: UserGetDTO): Promise<Pagination<UserDocument>>;

}