import { DocumentModel } from '@core/model/document';
import { ObjectId } from 'mongodb';



export interface ConfessionDocument extends DocumentModel {
  title:string;
  content:string;
  author:ObjectId;
}