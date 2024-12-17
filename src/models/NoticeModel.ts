import * as T from '@/@types';

export interface NoticeInterface {
  noticeId: number;
  personaId: number;
  roomId: number;
  isActive: boolean;
  noticeBody: T.NoticeBody;
  noticeType: T.MessageType[];
  isDeleted: boolean;
  createdAt: T.TimeStampString;
  pinnedAt: T.TimeStampString;
}

export class NoticeModel implements NoticeInterface {
  noticeId: number;
  personaId: number;
  roomId: number;
  isActive: boolean;
  noticeBody: T.NoticeBody;
  noticeType: T.MessageType[];
  isDeleted: boolean;
  createdAt: T.TimeStampString;
  pinnedAt: T.TimeStampString;

  constructor(notice: NoticeInterface) {
    this.noticeId = notice.noticeId;
    this.personaId = notice.personaId;
    this.roomId = notice.roomId;
    this.isActive = notice.isActive;
    this.noticeBody = notice.noticeBody;
    this.noticeType = [];
    this.isDeleted = notice.isDeleted;
    this.createdAt = notice.createdAt;
    this.pinnedAt = notice.pinnedAt;

    for (const [key, value] of Object.entries(T.msgType)) {
      if (value & Number(notice.noticeType))
        this.noticeType.push(key as T.MessageType);
    }
  }

  get updatedAt(): T.TimeStampString {
    return this.pinnedAt ?? this.createdAt;
  }
}
