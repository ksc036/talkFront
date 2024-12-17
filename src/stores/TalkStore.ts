import { makeAutoObservable } from 'mobx';

import { copyObject } from '@/utils';
import { AppIds, JsonMessage } from '@types';

type Listener = (args: JsonMessage) => void;

export class TalkStore {
  private _isMini = false;
  private eventHandlerMap: Map<string, Listener[]> = new Map();
  private _roomTypeList: any[] = [];
  private _retryFlag = false;
  private _isLoading = false;
  private _appId = '0';

  initEventListener = () => {
    window.addEventListener('message', ({ data }) => {
      if (data?.type === 'shell:onClientMessage') {
        const { jsonMessage, message } = data.data;
        const jsonObject = copyObject(jsonMessage);
        const handlerList = this.eventHandlerMap.get(message);
        if (!!jsonObject.voteId) {
          jsonObject.voteId = Number(jsonObject.voteId);
          jsonObject.voteItems.map((item: any) => {
            item.imageId = Number(item.imageId);
            item.voteItemId = Number(item.voteItemId);
            item.voteCount = Number(item.voteCount);
            item.personaIds = item.personaIds.map(Number);
          });
        }
        jsonObject.roomId = Number(jsonObject.roomId);
        jsonObject.personaId = Number(jsonObject.personaId);
        jsonObject.isDeleted = Number(jsonObject.isDeleted);
        jsonObject.msgId = Number(jsonObject.msgId);
        jsonObject.msgType = Number(jsonObject.msgType);
        if (!!jsonObject.lastReadMsgId) {
          jsonObject.lastReadMsgId = Number(jsonObject.lastReadMsgId);
        }
        if (!!jsonObject.reactionId) {
          jsonObject.reactionId = Number(jsonObject.reactionId);
        }
        if (!!jsonObject.linkId) {
          jsonObject.linkId = Number(jsonObject.linkId);
        }
        if (!!jsonObject?.parentId) {
          jsonObject.parentId = Number(jsonObject.parentId);
        }
        if (!!jsonObject?.parentBody?.personaId) {
          jsonObject.parentBody.personaId = Number(
            jsonObject.parentBody.personaId,
          );
        }
        if (!!jsonObject.msgBody && 'voteId' in jsonObject.msgBody) {
          jsonObject.msgBody.voteId = Number(jsonObject.msgBody.voteId);
        }
        if (!!jsonObject.msgBody && 'noticeId' in jsonObject.msgBody) {
          jsonObject.msgBody.noticeId = Number(jsonObject.msgBody.noticeId);
        }
        if (!!jsonObject.msgBody && 'linkId' in jsonObject.msgBody) {
          jsonObject.msgBody.linkId = Number(jsonObject.msgBody.linkId);
        }
        if (!!jsonObject.msgBody?.memberList) {
          jsonObject.msgBody.memberList = jsonObject.msgBody?.memberList.map(
            (item: string | number) => Number(item),
          );
        }
        if (!!jsonObject.msgBody?.requestId)
          jsonObject.msgBody.requestId = Number(jsonObject.msgBody.requestId);
        if (
          !!jsonObject.msgBody?.noticeBody &&
          'voteId' in jsonObject.msgBody.noticeBody
        ) {
          jsonObject.msgBody.noticeBody.voteId = Number(
            jsonObject.msgBody.noticeBody.voteId,
          );
        }
        if (!!jsonObject?.noticeBody && 'voteId' in jsonObject?.noticeBody) {
          jsonObject.noticeBody.voteId = Number(jsonObject?.noticeBody.voteId);
        }
        if (!!jsonObject.msgBody?.files?.[0]) {
          jsonObject.msgBody.files[0].id = Number(
            jsonObject.msgBody.files[0].id,
          );
          jsonObject.msgBody.files[0].size = Number(
            jsonObject.msgBody.files[0].size,
          );
        }
        if (!!jsonObject.targetId) {
          jsonObject.targetId = Number(jsonObject.targetId);
        }
        if (!!jsonObject.msgIds) {
          jsonObject.msgIds = jsonObject.msgIds.map(Number);
        }
        if (!!jsonObject.childMsgIds) {
          jsonObject.childMsgIds = jsonObject.childMsgIds.map(Number);
        }
        if (!!jsonObject.msgBody?.mailId) {
          jsonObject.msgBody.mailId = Number(jsonObject.msgBody.mailId);
        }
        if (!!jsonObject.msgBody?.calId) {
          jsonObject.msgBody.calId = Number(jsonObject.msgBody.calId);
        }
        if (!!jsonObject.msgBody?.eventId) {
          jsonObject.msgBody.eventId = Number(jsonObject.msgBody.eventId);
        }
        if (!!jsonObject.targetDay) {
          jsonObject.targetDay = Number(jsonObject.targetDay);
        }

        handlerList?.forEach((handler) => handler(jsonObject));
      }
    });
  };

  constructor() {
    makeAutoObservable(this);
    this.initEventListener();
  }

  get isMini(): boolean {
    return this._isMini;
  }

  get roomTypeList(): string[] {
    return this._roomTypeList;
  }

  get retryFlag() {
    return this._retryFlag;
  }

  get isLoading() {
    return this._isLoading;
  }

  get appId() {
    return this._appId === '0'
      ? window.APP_ID !== ''
        ? window.APP_ID
        : AppIds.TALK
      : this._appId;
  }

  setIsMini(isMini: boolean) {
    this._isMini = isMini;
  }

  setRoomTypeList(roomType: string[]) {
    this._roomTypeList = roomType;
  }

  makeHandler(type: string, listener: Listener) {
    let handlerList = this.eventHandlerMap.get(type);
    if (handlerList) handlerList.push(listener);
    else {
      handlerList = [listener];
      this.eventHandlerMap.set(type, handlerList);
    }
  }

  addHandler(event: string, handler: (data: JsonMessage) => unknown) {
    this.makeHandler(event, handler);
  }

  getMessageRetry() {
    this._retryFlag = !this.retryFlag;
  }

  setIsLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }

  setAppId(appId: string) {
    this._appId = appId;
  }
}
