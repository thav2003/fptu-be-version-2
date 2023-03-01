import { RawConfessionCreateDTO, RawConfessionGetDTO } from '@dto/rawConfessionDTO';
import { RawConfessionDocument } from '@models';
import { Pagination } from '@utils/pagination';




export interface IConfessionService {
  getAllRaws(data: RawConfessionGetDTO): Promise<Pagination<RawConfessionDocument>>;
  createRaw(data:RawConfessionCreateDTO):Promise<void>
}