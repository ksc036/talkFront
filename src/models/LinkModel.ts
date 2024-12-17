import { MessageInterface, MessageModel } from '@/models';
import { MsgBody } from '@types';

export interface LinkModel {
  roomId: number;
  msgId: number;
  linkId?: number;
  ogUrl: MsgBody['ogUrl'];
  ogTitle: MsgBody['ogTitle'];
  ogDescription: MsgBody['ogDescription'];
  ogImageUrl: MsgBody['ogImageUrl'];
  createdAt: MessageInterface['createdAt'];
  personaId: number;
}

export interface LinkObjectModel {
  date: string;
  links: LinkModel[];
}

export class Link implements LinkModel {
  roomId;
  msgId;
  linkId;
  ogUrl;
  ogTitle;
  ogDescription;
  ogImageUrl;
  createdAt;
  personaId;
  constructor(msg: MessageModel) {
    this.roomId = msg.roomId;
    this.msgId = msg.msgId;
    this.linkId = msg.msgBody.linkId;
    this.ogUrl = msg.msgBody.ogUrl;
    this.ogTitle = msg.msgBody.ogTitle;
    this.ogDescription = msg.msgBody.ogDescription;
    this.ogDescription = msg.msgBody.ogDescription;
    this.ogImageUrl = msg.msgBody.ogImageUrl;
    this.createdAt = msg.createdAt;
    this.personaId = msg.personaId;
  }
}
