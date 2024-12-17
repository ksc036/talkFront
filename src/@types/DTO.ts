import { EmoticonKey, MentionProps, MessageId } from './common';
import {
  AutoMsgType,
  FileBody,
  MessageType,
  MsgBody,
  VoteStateType,
} from './message';

export type LastReadMessageId = {
  roomId: number;
  personaId: number;
  lastReadMsgId: number;
};

export type RoomUnreadCountInfo = {
  roomId: number;
  count: number;
};

export type RoomLastMessage = {
  roomId: number;
  isDeleted: -1 | 0 | 1;
  msgBody: MsgBody;
  msgType: number;
  msgId: MessageId;
  createdAt: string;
  count: number;
  personaId: number;
};

export type ReadMsgType = 'room-in' | 'focus-in' | 'focus-out' | 'room-out';

export type NoticeCreateDto = {
  content?: string;
  ogUrl?: string;
  mention?: MentionProps[];
  sticker?: EmoticonKey;
  files?: FileBody[];
  noticeId?: number;
  noticeBody?: {
    content?: string;
    mention?: MentionProps[];
    voteId?: number;
    voteBody?: {
      title: string;
      content: string;
      voteItems: {
        itemContent: string;
        voteCount: number;
      }[];
    };
    voteStateType?: VoteStateType;
  };
  autoMsgType?: AutoMsgType;
  targetIds?: number[];
  requestId?: number;
  ogTitle?: string;
  ogImageUrl?: string;
  ogDescription?: string;
};

export type RoomInfo = {
  roomId: number;
  roomEnterTime?: string | null;
};

export type ReserveCreateDto = {
  content: string;
};
