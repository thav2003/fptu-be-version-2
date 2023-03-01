import { RawConfessionCreateDTO, RawConfessionGetDTO } from '@dto/rawConfessionDTO';
import { RawConfessionDocument } from '@models';
import { IRawConfessionRepository } from '@repository/Interface';
import { IConfessionService } from '@services/Interface';
import { TYPES } from '@src/types';
import paginate, { Pagination } from '@utils/pagination';
import { inject, injectable } from 'inversify';




@injectable()
export class ConfessionService implements IConfessionService {

  @inject(TYPES.RawConfessionRepository) private rawConfessionRepository: IRawConfessionRepository;

  public async createRaw(data: RawConfessionCreateDTO): Promise<void> {
    const createData = data as RawConfessionDocument;
    createData.status = 0;
    await this.rawConfessionRepository.create(createData);
  }

  public async getAllRaws(data: RawConfessionGetDTO): Promise<Pagination<RawConfessionDocument>> {
    let documents: RawConfessionDocument[];
    const filter = data.filter || {};
    documents = await this.rawConfessionRepository.find(filter, data.limit, data.pageNumber);
    const totalRecord = await this.rawConfessionRepository.countAll(filter);
    return paginate(documents, data.limit, data.pageNumber, totalRecord, data.path);
  }
}