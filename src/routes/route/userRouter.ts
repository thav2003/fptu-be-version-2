import { UserController } from '@controllers';
import CustomRoute from '../CustomRoute';
import container from '../../injector';
import asyncWrap from '@utils/asyncWrapper';
export default class UserRouter extends CustomRoute<UserController> {
  constructor() {
    super(container.get<UserController>(UserController));
    this.name = 'users';
    this.getAll();
    this.getById();

  }

  protected getAll(path:string = '/') {
    this.protectedRoute();
    this.isRole(['admin']);
    this.router.route(path).get(asyncWrap(this.controller.find.bind(this.controller)));
  }

  protected getById(path:string = '/:id') {
    this.protectedRoute();
    this.isRole(['admin']);
    this.router.route(path).get(asyncWrap(this.controller.get.bind(this.controller)));
  }
}