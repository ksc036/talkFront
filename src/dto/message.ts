import { RoomInfo } from '@/@types/DTO';
import { MsgBody } from '@types';

export interface CreateMessageDto {
  msgType: number;
  msgBody: MsgBody;
  parentId?: number;
  rawContent?: string;
  tempId?: string;
  appId: string;
  targetRoomId: number;
  nick: string;
  roomName: string;
}

export interface uploadDto {
  roomId: number;
  targetFolderId: number | null;
}

export interface DeleteFileDto {
  deleted: number;
  objectList: {
    objectId: number;
    objectName: string;
    objectExtension: string;
    objectType: number;
  }[];
  roomId: number;
}

export interface AuthCheckFileDto {
  documentId: number;
  userId: string;
}

export interface CopyFileDto {
  objectId: string;
  roomId: string;
  copyObjectIODTO: {
    newObjectId: null;
    originObjectExtension: string;
    originObjectId: number;
    originObjectName: string;
    savedInDB: number;
    targetFolderId: null;
  }[];
  location: null;
  roleIds: number[];
  targetRoomId: number;
  userId: string;
  userIds: string[];
}

export interface SyncFileDto {
  appIdFrom: string;
  appIdTo: string[];
  eventId: 'superdocs';
  eventType: 'websocket_push';
  roomId: string;
  senderId: 'wapltalk';
  message: string;
}

export interface SyncFileDtoMsg {
  type: 0;
  objectId: [string];
  objectType: 1;
  producerId: 'wapltalk';
}

export interface CreateMeetingDto {
  name: string;
  nick: string;
  appId: string;
  joinPolicy: {
    candidates: {
      key: string;
      role: string;
    }[];
  };
}

export interface SearchRoomNameReqDto {
  keyword: string;
}

export interface SearchRoomNameResDto {
  generalRoomInfoList: RoomInfo[];
}
