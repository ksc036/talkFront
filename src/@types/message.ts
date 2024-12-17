import { makeAutoObservable } from 'mobx';

import { VoteModel } from '@/models/VoteModel';

import { BotType, VOCType, RoleType } from './bot';
import { MentionProps, EmoticonKey } from './common';

export type ReplyInfoType = {
  senderName: string;
};

export const msgType = {
  text: 1,
  file: 2,
  image: 4,
  sticker: 8,
  vote: 16,
  notice: 32,
  autoMsg: 64,
  url: 128,
  meeting: 256,
  mail: 512,
  contact: 1024,
  video: 2048,
  bot: 4096,
  calendar: 8192,
  editor: 16384,
};

export type MessageType = keyof typeof msgType;

export type MessageFetchStateType = 'init' | 'loading' | 'done';

export type VoteItem = {
  itemContent: string;
  voteCount: number;
};

export type VoteBody = {
  title: string;
  content: string;
  voteItems: VoteItem[];
};

export interface FileBodyInterface {
  id: number;
  name: string;
  extension: string;
  size: number;
  tempURL?: string;
  isDeleted?: 0 | 1;
}

export class FileBody implements FileBodyInterface {
  id: number;
  name: string;
  extension: string;
  size: number;
  tempURL?: string;
  isDeleted?: 0 | 1;

  constructor(fileBody: FileBodyInterface) {
    this.id = fileBody.id;
    this.name = fileBody.name;
    this.extension = fileBody.extension;
    this.size = fileBody.size;
    this.tempURL = fileBody.tempURL;
    this.isDeleted = fileBody.isDeleted;

    makeAutoObservable(this);
  }

  setFileDeleted(deleteType: 0 | 1) {
    this.isDeleted = deleteType;
  }
}
export type MessageDocumentsIds = {
  msgId: number;
  documentIds: number[];
};

export type MeetingStateType = 'START' | 'END' | 'CREATE' | 'UPDATE';

export type VoteStateType = 'CREATE' | 'END' | 'DELETE' | 'ENDING';

export type AutoMsgType =
  | 'room-create-Open'
  | 'room-create-Private'
  | 'room-create-Dm'
  | 'room-delete'
  | 'room-update'
  | 'member-in-Open'
  | 'member-in-Private'
  | 'member-out'
  | 'member-out-Open'
  | 'member-out-Private'
  | 'member-kick';

export type VOCBody = {
  vocId?: string;
};

export type RoleBody = {
  beforeLevel?: number;
  afterLevel?: number;
  employeePersonaId?: number;
  beforeMasterPersonaId?: number;
  afterMasterPersonaId?: number;
};

export type EventBody = {
  allDay: boolean;
  eventName: string;
  startTime?: string;
  endTime?: string;
};

export type MeetingBody = {
  meetingRoomName: string;
  startTime?: string;
  endTime?: string;
};

export type MsgBody = {
  // 1 text
  content?: string;
  mention?: MentionProps[];

  // 2 file, 4 image, 2048 video
  files?: FileBody[];
  fileId?: number;
  fileName?: string;
  fileExtension?: string;
  fileSize?: string;

  // 8 sticker
  sticker?: EmoticonKey;

  // 16 vote
  voteId?: number;
  voteBody?: VoteModel | null;
  voteStateType?: VoteStateType;

  // 32 notice
  noticeId?: number;
  noticeBody?: {
    content?: string;
    mention?: MentionProps[];
    voteId?: number;
    voteBody?: VoteBody;
    voteStateType?: VoteStateType;
  };

  // 64 autoMsg
  autoMsgType?: AutoMsgType;
  memberList?: number[];
  requestId?: number;
  roomName?: string;

  // 128 url
  ogTitle?: string;
  ogUrl?: string;
  ogImageUrl?: string;
  ogDescription?: string;
  linkId?: number;

  // 256 meeting
  meetingBody?: MeetingBody;
  meetingType?: MeetingStateType;
  subRoomId?: number;
  meetingId?: number;

  // 512 mail
  mailId?: number;
  mailStateType?: 'RECEIVE' | 'SEND';
  title?: string;
  personaId?: number;
  roomId?: number;
  senderName?: string;
  profileUrl?: string;
  exSenderName?: string;
  exEmail?: string;
  exProfileUrl?: string;

  // 4096 bot
  botId?: number;
  botType?: BotType;
  vocType?: VOCType;
  roleType?: RoleType;
  vocBody?: VOCBody;
  roleBody?: RoleBody;

  // 8192 calendar
  calId?: number;
  eventId?: number;
  eventType?: 'SHARE' | 'DELETE' | 'CREATE' | 'START_NOTI' | 'START';
  notiTime?: string;
  eventBody?: EventBody;
};

export type MessageMenu =
  | 'reply'
  | 'reaction'
  | 'copy'
  | 'save'
  | 'deliver'
  | 'notice'
  | 'unreadUser'
  | 'delete'
  | 'blind'
  | 'report';
