import { MongoClient, Db, Collection } from 'mongodb';
import logger from './logger';

/**
 * All the methods and properties mentioned in the following class is
 * specific to MongoDB. You should make necessary changes to support
 * the database you want to use.
 */

class Database {
  private password: string;

  private user: string;

  private host: string;

  private dbName: string;

  private dbClient: MongoClient;

  private databaseInstance: Db;

  constructor() {
    this.password = process.env.DB_PWD || '';
    this.user = process.env.DB_USER || '';
    this.host = process.env.DB_HOST || 'localhost:27017';
    this.dbName = process.env.DB_NAME || 'fptu';
  }

  public async connect(): Promise<void> {
    if (this.dbClient) {
      logger.debug('Connection already exists');
      return;
    }

    const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

    const connectionString = this.getConnectionString();
    logger.debug(`Database connection string: ${connectionString}`);

    const client = new MongoClient(connectionString, {
      maxPoolSize: 50,
      connectTimeoutMS: TWO_MINUTES_IN_MS,
      socketTimeoutMS: ONE_DAY_IN_MS,      
    });
    this.dbClient = await client.connect();
    logger.info('Connected with database host');
    
    this.databaseInstance = this.dbClient.db(this.dbName);
  }

  public async disconnect() {
    if (this.isDbConnected()) {
      logger.info(`Disconnected from ${this.host}/${this.dbName}`);
      await this.dbClient.close();
    }
  }


  /**
   * For MongoDB there is no table. It is called collection
   * If you are using SQL database then this should be something like getTable()
   *
   * @param name MongoDB Collection name
   */
  public getCollection(name: string): Collection {
    if (!this.databaseInstance) {
      throw new Error('Database not initialized');
    }

    return this.databaseInstance.collection(name);
  }

  /**
   * Build database connection string.
   * Customize as needed for your database.
   */
  private getConnectionString() {
    if (process.env.NODE_ENV === 'development') {
      this.dbName += '_test';
    }
    
    if (process.env.MONGO_URI) {
      return process.env.MONGO_URI;
    }
    
    return `mongodb+srv://${this.host}/${this.dbName}`;
  }

  public getDbHost() {
    return this.host;
  }

  public getDbPassword() {
    return this.password;
  }

  public getDbUser() {
    return this.user;
  }

  public getDbName() {
    return this.dbName;
  }

  //   public isDbConnected() {
  //     return this.dbClient && this.dbClient.isConnected();
  //   }
  
  public async isDbConnected() {
    if (!this.databaseInstance) {
      return false;
    }

    let res;

    try {
      res = await this.databaseInstance.admin().ping();
    } catch (err) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(res, 'ok') && res.ok === 1;
  }
}

const db = new Database();

export default db;