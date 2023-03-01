// import { install as installSourceMapSupport } from 'source-map-support';
// installSourceMapSupport();
import 'source-map-support/register';
import 'reflect-metadata';
import * as express from 'express';
import * as compress from 'compression';
import app from './server';
import * as cors from 'cors';
import routes from './routes';
import errorHandler from './errors/error.handler';
import logger from './logger';
import initDB from './database';
import * as cookieParser from 'cookie-parser';
/**
 * This is a bootstrap function
 */
async function bootstrap() {
  // Attach HTTP request info logger middleware in test mode
  if (process.env.NODE_ENV === 'development') {
    app.use((req: express.Request, _res, next) => {
      logger.debug(`[${req.method}] ${req.hostname}${req.url}`);

      next();
    });
  }

  app.disable('x-powered-by'); // Hide information
  app.use(compress()); // Compress

  // Enable middleware/whatever only in Production
  if (process.env.NODE_ENV === 'production') {
    // For example: Enable sentry in production
    // app.use(Sentry.Handlers.requestHandler());
  }

  /**
  * Configure cookies
  */
  app.use(cookieParser());

  /**
   * Configure cors
   */
  app.use(cors());

  /**
   * Configure mongoose
   **/
  if (! await initDB.isDbConnected()) {
    await initDB.connect();
  }

  /**
   * Configure body parser
   */
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));


  /**
   * Host static public directory
   */
  app.use('/', express.static('public'));

  /**
   * Configure routes
   */
  routes(app);

  /**
   * Configure error handler
   */
  errorHandler(app);
}

// Need for integration testing
export default app;

// Invoking the bootstrap function
bootstrap()
  .then(() => {
    logger.info('Server is up');
  })
  .catch((error) => {
    logger.error('Unknown error. ' + error.message);
  });