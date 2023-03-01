
import { injectable } from 'inversify';
import { RefreshTokenDocument } from '@models';
import Repository from '@core/repository/repository';
import { IRefreshTokenRepository } from '@repository/Interface';



@injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenDocument> implements IRefreshTokenRepository {
  constructor() {
    super('refresh_tokens'); // Passing collection name
  }
}