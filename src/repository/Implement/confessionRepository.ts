
import { injectable } from 'inversify';
import Repository from '@core/repository/repository';
import { ConfessionDocument } from '@models';
import { IConfessionRepository } from '@repository/Interface';



@injectable()
export class ConfessionRepository extends Repository<ConfessionDocument> implements IConfessionRepository {
  constructor() {
    super('confessions'); // Passing collection name
  }
}