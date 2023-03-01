
import { DocumentModel } from '@core/model/document';


export interface UserDocument extends DocumentModel {
  name: string;
  email: string;
  password: string;
  passwordConfirm:string;
  role: string;
  status:boolean;
  active:boolean;
}

