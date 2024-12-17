import { MsgBody } from './message';

export type MessageId = number;
export type TimeStampString = string; // YYYY-MM-DD HH:mm TIMEZONE 형식의 문자열(ex. 2021-10-12 13:47 Asia/Seoul)
export type PersonaId = number;
export type ReactionId = number;

export type i18nKey = string;
export type GroupId = string; // SpaceId
export type RoomId = number;
export type AppId = string;
export type TempMessageId = string;
export type NoticeId = number;
export type UserLoginEmail = string; // E-mail
export type EmoticonKey = string; // :slightly smiling face:
export type Base64 = string;
export type VotingId = string;
export type VotingItemId = string;

export type TalkOptions = {
  // isActive: any; // FIXME: 함수 타입
  useDesktopNotification: boolean;
  focusedRoomId: RoomId;
};

export type WWMS = {
  NOTI_ETC: string;
  SPACE_ID: GroupId;
  USER_LOGIN_ID: UserLoginEmail;
  NOTI_TIME: string;
};

export const AppIds = {
  TALK: 'tmax.core-ai.talk',
  CALENDAR: 'tmax.core-ai.calendar',
  DOCS: 'tmax.ga.docs',
  MEETING: 'tmax.cloud.meeting',
  MESSAGE: 'tmax.core-ai.message',
};

export enum Key {
  ENTER = 'Enter',
}

export enum KeyCode {
  ESC = 27,
  ENTER = 13,
}

export enum Language {
  KO = 'ko',
  KO_KR = 'ko-KR',
  EN = 'en',
}

export enum RefKey {
  CHAT_CONTAINER = 0,
  NEW_MESSAGE = 1,
  FOOTER = 2,
  CONTENT = 3,
  POPUP_SCROLL_BUTTON = 4,
  POPUP_SCROLL_MESSAGE = 5,
}

export enum NoticeAlertType {
  CREATE = 0,
  EDIT = 1,
  NOT_FOUND = 3,
}

export enum UserGrade {
  BOT = 'bot',
}

export enum Host {
  DEFAULT = 'WAPL',
  WAPL = 'WAPL',
  CNU = 'CNU',
}

export enum ServiceAlarmButton {
  NEW_TAB = 'new_tab',
  UI = 'UI',
  ROUTING = 'routing',
}

export enum ServiceType {
  NOTICE = 'notice',
  VOTING = 'voting',
}

export enum StoreState {
  INIT,
  LOADING, // 서버에서 데이터 불러오는 상태
  NOMORE, // 더이상 불러올 데이터가 없는 상태
  DONE, // 데이터가 정상적으로 fetch가 된 상태
}

export interface MentionProps {
  mentionId: number;
  mentionName: string;
}

export interface UserInfo {
  id: number;
  isMyId: boolean;
}

export interface FileInfo {
  name: string;
  extension: string;
  size: number;
}

export type RoomLastMessage = {
  roomId: number;
  metadata: {
    lastMessage: MsgBody['content'];
    lastMessageDate: Date;
    lastMessageId: MessageId;
    count: number;
  };
};

export interface MyFocus {
  sessionId: string;
  roomId: number;
  userId: number;
}

export interface Authority {
  isMine: boolean;
  isMyRoom: boolean;
  isRoomLeader: boolean;
  isAdmin?: boolean;
}

export interface BottomItemsType {
  Album: boolean;
  Camera: boolean;
  Drive: boolean;
  Drawer: boolean;
  File: boolean;
  Notice: boolean;
  Vote: boolean;
  Mail: boolean;
  Contact: boolean;
  Reserve: boolean;
}

export interface FooterMenuItemsType {
  Mail: boolean;
  Emoticon: boolean;
  Vote: boolean;
  Notice: boolean;
  File: boolean;
  Reserve: boolean;
  Editor: boolean;
}

export interface HeaderMenuItemsType {
  DateSearch: boolean;
  File: boolean;
  Meeting: boolean;
  RoomMenu: boolean;
  Calendar: boolean;
  MiniChat: boolean;
}

export type MentionType = 'None' | 'List' | 'Search';

export type MemberSelectorSearchType =
  | 'uId'
  | 'name'
  | 'orgName'
  | 'jobtitleName'
  | 'positionName'
  | 'jobgradeName'
  | 'jobkindName'
  | 'jobName';
