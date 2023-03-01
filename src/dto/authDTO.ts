

export interface GetUserLoginDTO {
  email: string;
  password: string;
}
export interface GetUserRegisterDTO {
  name:string;
  email: string;
  role:string;
  password: string;
  passwordConfirm:string;
}