import { makeAutoObservable, transaction } from 'mobx';

import * as T from '@/@types';
import { ROOMLINK_MESSAGE, WELCOME_MESSAGE } from '@/constants';
import { isEmptyObj } from '@/utils';

import { ReactionModel } from './ReactionModel';

export interface MessageInterface {
  msgId: T.MessageId;
  roomId: T.RoomId;
  msgBody: T.MsgBody;
  msgType: T.MessageType[] | number;
  createdAt: T.TimeStampString;
  personaId: number;
  reactions?: ReactionModel[];
  isDeleted: number;
  rawContent: string;
  parentId?: T.MessageId;
  parentBody?: {
    personaId: number;
    msgType: T.MessageType[];
    msgBody: T.MsgBody;
    isDeleted: number;
  };
  tempId?: string;
  linkId?: number;
}

export interface TotalSearchMessageInterface {
  roomId: T.RoomId;
  cnt?: number;
  userId: T.PersonaId;
  msgId: T.MessageId;
  rawContent: string;
  msgBody: T.MsgBody;
  createdAt: T.TimeStampString;
}

export interface ParentBodyInterface {
  personaId: number;
  msgType: T.MessageType[];
  msgBody: T.MsgBody;
  isDeleted: number;
}

class ParentBody implements ParentBodyInterface {
  personaId: number;
  msgType: T.MessageType[];
  msgBody: T.MsgBody;
  isDeleted: number;

  constructor(parentBody: ParentBodyInterface) {
    this.personaId = parentBody.personaId;
    this.msgType = parentBody.msgType;
    this.msgBody = parentBody.msgBody;
    this.isDeleted = parentBody.isDeleted;

    makeAutoObservable(this);
  }

  setDeleted(deleteType: number): void {
    this.isDeleted = deleteType;
  }
}

export class MessageModel implements MessageInterface {
  msgId: T.MessageId;
  msgBody: T.MsgBody;
  msgType: T.MessageType[];
  createdAt: T.TimeStampString;
  personaId: number;
  roomId: T.RoomId;
  reactions: ReactionModel[];
  unReadCount: number;
  isDeleted: number;
  rawContent: string;
  parentId?: T.MessageId;
  parentBody?: ParentBody;
  tempId?: string;
  isFirst: boolean;
  isHead: boolean;
  isTail: boolean;
  linkId?: number;

  constructor(message: MessageInterface) {
    this.msgId = message.msgId;
    this.msgBody = message.msgBody;
    this.msgType = [];
    this.createdAt = message.createdAt;
    this.personaId = message.personaId;
    this.roomId = message.roomId;
    this.reactions =
      !message.reactions || message.reactions.length === 0
        ? []
        : message.reactions;
    this.unReadCount = 0;
    this.isDeleted = message.isDeleted;
    this.rawContent = message.rawContent;
    this.parentId = message.parentId;
    this.tempId = message.tempId;
    this.linkId = message.linkId;
    this.isFirst = false; // 해당 날짜의 첫 번째 메시지
    this.isHead = false; // 연속된 메시지 중 첫 번째 메시지
    this.isTail = false; // 연속된 메시지 중 마지막 메시지

    for (const [key, value] of Object.entries(T.msgType)) {
      if (value & Number(message.msgType)) {
        this.msgType.push(key as T.MessageType);
      }
    }
    // 웰컴 메시지 스트링 적용
    if (
      this.msgType.includes('autoMsg') &&
      this.msgBody.autoMsgType === 'room-create-Dm'
    )
      this.msgBody.content = WELCOME_MESSAGE;
    // 초대 링크 메시지 스트링 적용
    if (
      message.parentBody &&
      !isEmptyObj(message.parentBody) &&
      message.parentId
    ) {
      const msgType: T.MessageType[] = [];
      for (const [key, value] of Object.entries(T.msgType)) {
        if (value & Number(message.parentBody.msgType))
          msgType.push(key as T.MessageType);
      }
      const parentBody = {
        personaId: message.parentBody.personaId,
        msgType,
        msgBody: message.parentBody.msgBody,
        isDeleted: message.parentBody.isDeleted ?? 0,
      };
      this.parentBody = new ParentBody(parentBody);
    } else {
      this.parentBody = undefined;
    }

    if (message.msgBody.files) {
      this.msgBody.files = this.msgBody.files?.map((file) => {
        return new T.FileBody(file);
      });
    }

    makeAutoObservable(this);
  }

  setFirst(isFirst: boolean): void {
    this.isFirst = isFirst;
  }

  setHead(isHead: boolean): void {
    this.isHead = isHead;
  }

  setTail(isTail: boolean): void {
    this.isTail = isTail;
  }

  setDeleted(deleteType: number): void {
    this.isDeleted = deleteType;
  }

  setParentDeleted(deleteType: number): void {
    if (this.parentBody) this.parentBody.setDeleted(deleteType);
  }

  setTempId(tempId: string) {
    this.tempId = tempId;
  }

  setOgInfo(
    ogDescription: string,
    ogImageUrl: string,
    ogTitle: string,
    linkId: number | undefined,
  ): void {
    transaction(() => {
      this.msgBody.ogDescription = ogDescription;
      this.msgBody.ogImageUrl = ogImageUrl;
      this.msgBody.ogTitle = ogTitle;
      this.msgBody.linkId = linkId;
    });
  }

  msgTypeNumber(): number {
    let typeNumber = 0;
    for (const [key, value] of Object.entries(T.msgType)) {
      if (this.msgType.includes(key as T.MessageType)) typeNumber += value;
    }
    return typeNumber;
  }

  setUnReadCount(unReadCount: number): void {
    this.unReadCount = unReadCount;
  }

  setDocumentDeleted(documentId: number): void {
    if (this.msgBody.files) {
      this.msgBody.files.forEach((file: T.FileBody) => {
        if (file.id === documentId) {
          file.setFileDeleted(1);
        }
      });
    }
  }

  get content(): string {
    const roomLinkTypes: T.MessageType[] = ['url', 'bot'];
    if (roomLinkTypes.every((v) => this.msgType.includes(v)))
      return `${ROOMLINK_MESSAGE + this.msgBody.content}`;
    return this.msgBody.content ?? '';
  }

  get parentContent(): string {
    const roomLinkTypes: T.MessageType[] = ['url', 'bot'];
    if (!!this.parentBody) {
      if (roomLinkTypes.every((v) => this.parentBody?.msgType.includes(v)))
        return `${ROOMLINK_MESSAGE + this.parentBody.msgBody.content}`;
      return this.parentBody.msgBody.content ?? '';
    }
    return '';
  }

  get isAutoMessage(): boolean {
    return (
      this.msgType.includes('autoMsg') &&
      this.msgBody.autoMsgType !== 'room-create-Dm'
    );
  }

  get isWelcomeMessage(): boolean {
    return (
      this.msgType.includes('autoMsg') &&
      this.msgBody.autoMsgType === 'room-create-Dm'
    );
  }

  get isRoomShareLink(): boolean {
    return this.msgType.includes('url') && this.msgType.includes('bot');
  }

  get isBotMessage(): boolean {
    return this.msgType.includes('bot') && !this.msgType.includes('url');
  }
}

export class TotalSearchMessageModel {
  hasMore: boolean;
  totalCnt: number;
  messages: TotalSearchMessageInterface[];

  constructor() {
    this.hasMore = false;
    this.totalCnt = 0;
    this.messages = [];
  }
}
