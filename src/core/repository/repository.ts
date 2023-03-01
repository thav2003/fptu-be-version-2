import { injectable, unmanaged } from 'inversify';
import { Collection, Filter, InsertOneResult, ObjectId } from 'mongodb';
import db from '@src/database';
import { getValidObjectId } from '@utils/utils';
import { IRepository } from './IRepository';
import { Select } from './ISelect';
import { Sort } from './ISort';
import { DocumentModel } from '@core/model/document';



/**
 * This Repository class is the base repository. It is an abstract class because it can only be
 * extended. This class is writen to support mongoose properly which means it will look different
 * if you use mongodb driver directly or use any other orm or database driver.
 *
 * The collection property is the mongoose collection in this case. For you, it can be mongodb collection for example.
 */
@injectable()
export default class Repository<T extends DocumentModel> implements IRepository<T> {

  protected readonly collection: Collection;

  constructor(@unmanaged() collection: string) {
    this.collection = db.getCollection(collection);
  }

  public async countAll(filter: Filter<Partial<T>> = {}):Promise<number> {
    const collection = this.collection;
    const query = collection.countDocuments(filter);
    return query;
  }

  public async get(id: ObjectId, select: Select = {}): Promise<T> {
    const objectId = getValidObjectId(id);

    const collection = this.collection;

    const doc: T = await collection.findOne<T>({ _id: objectId }, select);

    return doc;
  }

  public async findOne(filter: Filter<Partial<T>> = {}, select?: Select): Promise<T> {
    const collection = this.collection;
    const doc = await collection.findOne<T>(filter, { projection:select });
    return doc;
  }

  public async find(filter: Filter<Partial<T>> = {}, limit: number = 10, page: number = 0, select?: Select, sort?: Sort): Promise<T[]> {
    const collection = this.collection;
    const query = collection.find<T>(filter, { projection:select });

    if (sort) {
      query.sort(sort);
    }

    if (page > 0) {
      const skip = limit * (page - 1);
      query.skip(skip);
    }
    query.limit(limit);

    const docs = await query.toArray();

    return docs;
  }
 
  public async create(data: Partial<T>): Promise<InsertOneResult> {
    if (!data) {
      throw new Error('Empty object provided');
    }
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.isDeleted = false;
    const collection = this.collection;
    // const doc = (await collection.insertOne(data)).ops[0] as T;
    const doc = (await collection.insertOne(data)) as InsertOneResult;

    return doc;
  }

  public createMany(_data: Partial<T[]>): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  public async update(_filter: Filter<T>, _data: Partial<T>, _multi: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updateById(ids: ObjectId | ObjectId[], data: Partial<T>) {
    let objectIds = [];

    if (Array.isArray(ids)) {
      objectIds = ids.map((id) => getValidObjectId(id));
    } else {
      objectIds = [getValidObjectId(ids as ObjectId)];
    }

    const collection = this.collection;
    await collection.updateOne({ _id: { $in: objectIds } }, data);
  }

  public async remove(filter: Filter<T>, multi: boolean): Promise<void> {
    const collection = this.collection;
    if (multi) {
      await collection.deleteMany(filter);
    } else {
      await collection.deleteOne(filter);
    }
  }

  public async removeById(ids: ObjectId | ObjectId[]): Promise<void> {
    let objectIds = [];

    if (Array.isArray(ids)) {
      objectIds = ids.map((id) => getValidObjectId(id));
    } else {
      objectIds = [getValidObjectId(ids as ObjectId)];
    }

    const collection = this.collection;
    await collection.deleteMany({ _id: { $in: objectIds } });
  }

  public getCollection(): Collection {
    return this.collection;
  }
}