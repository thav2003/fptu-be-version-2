import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { IRawConfessionRepository } from '@repository/Interface';
import { TYPES } from '@src/types';
import { injectable, inject } from 'inversify';
import { MissingFieldError } from '@src/errors/app.errors';
import { getValidObjectId } from '@utils/utils';
import { RawConfessionCreateDTO, RawConfessionGetDTO } from '@dto/rawConfessionDTO';
import { RawConfessionDocument } from '@models';
import { Filter } from 'mongodb';
import { IConfessionService } from '@services/Interface';
import { CustomResponse } from '@middleware/checkJwt';



@injectable()
export class ConfessionController {


  @inject(TYPES.ConfessionService) private confessionService: IConfessionService;

  @inject(TYPES.RawConfessionRepository) private rawConfessionRepository: IRawConfessionRepository;
    
  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async getRawById(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const user = await this.rawConfessionRepository.get(getValidObjectId(req.params.id));
    res.send(user);
  }

  public async findRaws(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : this.limit;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : 1;
    const filter = {
      status:1,
    };

    console.log(JSON.stringify(filter));
    const getRawConfessionDto: RawConfessionGetDTO = {
      pageNumber,
      limit,
      filter: req.query.filter as Filter<Partial<RawConfessionDocument>>,
      path: req.baseUrl,
    };

    const response = await this.confessionService.getAllRaws(getRawConfessionDto);
    res.send(response);
  }

  public async createRaw(req: ExpressRequest, res: CustomResponse): Promise<void> {
    if (!req.body.content) {
      throw new MissingFieldError('content');
    }
    const currentUser = res.locals.user;

    const createRawDto:RawConfessionCreateDTO = {
      content:req.body.content,
      sender:currentUser._id,
    };
    await this.confessionService.createRaw(createRawDto);
    res.sendStatus(201);
  }
    
}