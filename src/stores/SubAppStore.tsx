import { makeAutoObservable } from 'mobx';

import { InstanceId } from '@/hooks/useSubApp';

export class SubAppStore {
  private _calendarInstance = '';
  // 드라이브, 0번 타입
  private _driveInstance = '';
  // 톡첨부함, 1번 타입
  private _talkDriveInstance = '';

  constructor() {
    makeAutoObservable(this);
  }

  get calendarInstance() {
    return this._calendarInstance;
  }

  get docsInstance() {
    return this._driveInstance;
  }

  get talkDocsInstance() {
    return this._talkDriveInstance;
  }

  setDriveInstance(id: InstanceId) {
    this._driveInstance = id;
  }

  setCalendarInstance(id: InstanceId) {
    this._calendarInstance = id;
  }

  setTalkDriveInstance(id: InstanceId) {
    this._talkDriveInstance = id;
  }
}
