import Repository from '@core/repository/repository';
import { RawConfessionDocument } from '@models';
import { IRawConfessionRepository } from '@repository/Interface';
import { injectable } from 'inversify';





@injectable()
export class RawConfessionRepository extends Repository<RawConfessionDocument> implements IRawConfessionRepository {
  constructor() {
    super('raw_confessions'); // Passing collection name
  }
}