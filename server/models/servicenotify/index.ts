import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
  modelOptions,
  Severity,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import _ from 'lodash';
import type { Types } from 'mongoose';

export class ServiceNotify extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;
  @prop()
  servenotifyid: string;
  @prop()
  text: string;
  @prop()
  link: string;

  /**
   * 创建群组
   */
  static async createServiceNotify(
    this: ReturnModelType<typeof ServiceNotify>,
    options: {
      servenotifyid: string;
      text: string; // base64版本的头像字符串
      link: string;
    }
  ): Promise<ServiceNotifyDocument> {
    const { servenotifyid, text, link } = options;

    // NOTE: Expression produces a union type that is too complex to represent.
    const res = await this.create({
      servenotifyid,
      text,
      link,
    });

    return res;
  }
}

export type ServiceNotifyDocument = DocumentType<ServiceNotify>;

const model = getModelForClass(ServiceNotify);

export type ServiceNotifyModel = typeof model;

export default model;
