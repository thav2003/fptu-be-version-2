/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export const TYPES = {
  UserController: Symbol('UserController'),
  AuthController: Symbol('AuthController'),
  ConfessionController: Symbol('ConfessionController'),

  RefreshTokenRepository: Symbol('RefreshTokenRepository'),
  UserRepository: Symbol('UserRepository'),
  ConfessionRepository: Symbol('ConfessionRepository'),
  RawConfessionRepository: Symbol('RawConfessionRepository'),

  UserService: Symbol('UserService'),
  AuthService: Symbol('AuthService'),
  ConfessionService:Symbol('ConfessionService'),


};