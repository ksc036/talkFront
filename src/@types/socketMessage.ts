import { ReactionModel } from '@/models';
import { VoteModel } from '@/models/VoteModel';
import * as T from '@types';

export type SocketMessage = {
  msgId: T.MessageId;
  roomId: T.RoomId;
  msgBody: T.MsgBody;
  msgType: T.MessageType[] | number;
  createdAt: T.TimeStampString;
  personaId: number;
  reactions?: ReactionModel[];
  isDeleted: number;
  rawContent: string;
  parentId: T.MessageId;
  parentBody: {
    personaId: number;
    msgType: T.MessageType[];
    msgBody: T.MsgBody;
    isDeleted: number;
  };
  tempId?: string;
  linkId?: number;
  userId: number;
  readMsgType: T.DTO.ReadMsgType;
  lastReadMsgId: T.MessageId;
  lastMessageId: T.MessageId;
  msgIds: T.MessageId[];
  childMsgIds?: T.MessageId[];
  deletedFrom: number;
  targetDay?: number;
  documentWebRes?: {
    documentId: number;
    msgId: number;
  }[];
};

export type NoticeMessage = {
  noticeId: number;
  personaId: number;
  roomId: number;
  isActive: boolean;
  noticeBody: T.NoticeBody;
  noticeType: T.MessageType[];
  isDeleted: boolean;
  createdAt: T.TimeStampString;
  pinnedAt: T.TimeStampString;
};

export type ReactionMessage = {
  reactionName: string;
  targetId: number;
  reactionId: number;
  targetType: string;
  personaId: number;
  roomId: number;
};

export type VoteMessage = VoteModel;

export type JsonMessage =
  | SocketMessage
  | NoticeMessage
  | ReactionMessage
  | VoteMessage;
