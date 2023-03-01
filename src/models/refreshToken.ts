
import { DocumentModel } from '@core/model/document';
import { ObjectId } from 'mongodb';

export interface RefreshTokenDocument extends DocumentModel {
  token:string;
  userId:ObjectId;
  expiryDate:Date;
}
