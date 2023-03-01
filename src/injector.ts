import { Container } from 'inversify';
import { TYPES } from './types';

//import controller
import { UserController, AuthController, ConfessionController } from '@controllers';

//import services
import { UserService, AuthService, ConfessionService } from '@services/Implement';
import { IUserService, IAuthService, IConfessionService } from '@services/Interface';

//import repository
import { IConfessionRepository, IRawConfessionRepository, IRefreshTokenRepository, IUserRepository } from '@repository/Interface';
import { UserRepository, RefreshTokenRepository, ConfessionRepository, RawConfessionRepository } from '@repository/Implement';


// const container = new Container({ defaultScope: 'Singleton' });
const container = new Container();
//controller
container.bind(UserController).to(UserController);
container.bind(AuthController).to(AuthController);
container.bind(ConfessionController).to(ConfessionController);

//repository
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);
container.bind<IConfessionRepository>(TYPES.ConfessionRepository).to(ConfessionRepository);
container.bind<IRawConfessionRepository>(TYPES.RawConfessionRepository).to(RawConfessionRepository);

//service
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IConfessionService>(TYPES.ConfessionService).to(ConfessionService);



export default container;