import { Collection, Filter, InsertOneResult, ObjectId } from 'mongodb';
import { Select } from './ISelect';
import { Sort } from './ISort';




/**
 * Base repository interface.
 */
export interface IRepository<T> {
  /**
     * Receives an ID and fetch data from database by that ID.
     *
     * @param id Id of the document
     * @param select Field to project properties. This is optional.
     */
  get(id: ObjectId, select?: Select): Promise<T>;
  
  /**
     * Get documents from collection.
     *
     * @param filter Filter query
     * @param limit Documetn limit per page
     * @param page Current page number
     * @param [select] Fields to select
     * @param [sort] Sort order
     *
     * @returns Array of documents
     */
  find(filter: Filter<Partial<T>>, limit: number, page?: number, select?: Select, sort?: Sort): Promise<T[]>;
  findOne(filter: Filter<Partial<T>>, select?: Select):Promise<T>;
  /**
     * Insert one item in the collection.
     *
     * @param data Object that you want to store
     */
  create(data: Partial<T>): Promise<InsertOneResult>;
  createMany(data: Partial<T[]>): Promise<T[]>;
  
  update(filter: Filter<T>, data: Partial<T>, multi: boolean): Promise<void>;
  updateById(ids: ObjectId | ObjectId[], data: Partial<T>): Promise<void>;
  
  /**
     * It finds all the matching documents by the given filter and removes them.
     *
     * @param filter FilterQuery
     */
  remove(filter: Filter<T>, multi: boolean): Promise<void>;
  
  /**
     * Remove documents from database by given IDs. This method receives one or more
     * IDs. Checks if the IDs are valid and proceed to delete.
     *
     * @param ids ObjectID | ObjectID[]
     */
  removeById(id: ObjectId | ObjectId[]): Promise<void>;
  
  /**
     * Get the collection instance of the repository.
     *
     * @returns MongoDB collection instance
     */
  getCollection(): Collection;
  
  /**
     * Get the amount document.
     *
     * @returns count the document
     */
  countAll(filter: Filter<Partial<T>>): Promise<number>;
  
}