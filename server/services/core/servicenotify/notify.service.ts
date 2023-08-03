import _ from 'lodash';
import { Types } from 'mongoose';
import { isValidStr } from '../../../lib/utils';
import type {
  ServiceNotify,
  ServiceNotifyDocument,
  ServiceNotifyModel,
} from '../../../models/servicenotify/index';
import {
  TcService,
  GroupBaseInfo,
  TcContext,
  TcDbService,
  PureContext,
  call,
  DataNotFoundError,
  EntityError,
  NoPermissionError,
  PERMISSION,
  GroupPanelType,
  PanelFeature,
  config,
} from 'tailchat-server-sdk';
import moment from 'moment';

interface ServiceNotifyService
  extends TcService,
    TcDbService<ServiceNotifyDocument, ServiceNotifyModel> {}
class ServiceNotifyService extends TcService {
  get serviceName(): string {
    return 'servicenotify';
  }

  onInit(): void {
    this.registerLocalDb(
      require('../../../models/servicenotify/index').default
    );

    this.registerAction('createServiceNotify', this.createServiceNotify, {
      params: {
        servenotifyid: 'string',
        text: 'string',
        link: 'string',
      },
    });
    this.registerAction('getAllNotify', this.getAllNotify);
  }

  /**
   * 创建群组
   */
  async createServiceNotify(
    ctx: TcContext<{
      servenotifyid: string;
      text: string;
      link: string;
    }>
  ) {
    const servenotifyid = ctx.params.servenotifyid;
    const text = ctx.params.text;
    const link = ctx.params.link;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    const group = await this.adapter.model.createServiceNotify({
      servenotifyid,
      text,
      link,
    });

    return this.transformDocuments(ctx, {}, group);
  }

  async getAllNotify(ctx: TcContext<{}>) {
    // const userId = ctx.meta.userId;

    // const users = await userModel.find(
    //   {
    //     // false 或 null(正式用户或者老的用户)
    //     temporary: {
    //       $ne: true,
    //     },
    //   },
    //   {
    //     _id: 1,
    //   }
    // );

    // userIds = users.map((u) => u._id);

    const list = await this.adapter.find({});

    const records: any = await this.transformDocuments(ctx, {}, list);
    // const res = records.map((r) => ({
    //   id: r.to,
    //   nickname: r.nickname,
    // }));

    return records;
  }
}

export default ServiceNotifyService;
