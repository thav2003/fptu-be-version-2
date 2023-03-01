import { DocumentModel } from '@core/model/document';
import { ObjectId } from 'mongodb';



export interface RawConfessionDocument extends DocumentModel {
  content:string;
  sender:ObjectId;
  status:number; // false: pending, true: approved
}