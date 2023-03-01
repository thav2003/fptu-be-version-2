import { AuthController } from '@controllers';
import CustomRoute from '../CustomRoute';
import container from '../../injector';
import asyncWrap from '@utils/asyncWrapper';
export default class AuthRouter extends CustomRoute<AuthController> {
  constructor() {
    super(container.get<AuthController>(AuthController));
    this.name = 'auth';
    this.login();
    this.register();
    this.refreshToken();
  }

  protected login():void {
    this.router.post('/login', asyncWrap(this.controller.login.bind(this.controller)));
  }

  protected register():void {
    this.router.post('/register', asyncWrap(this.controller.register.bind(this.controller)));
  }

  protected refreshToken():void {
    this.router.get('/refresh', asyncWrap(this.controller.refresh.bind(this.controller)));
  }
}