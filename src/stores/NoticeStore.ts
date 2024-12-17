import { makeAutoObservable } from 'mobx';

import { NoticeRepository, NoticeRepoImpl } from '@/repositories';
import { toggleNoticePreseneceState } from '@/utils';
import { DTO, NoticeMessage } from '@types';

import { NoticeInterface, NoticeModel } from './../models/NoticeModel';
import { RootStore } from './RootStore';

export class NoticeStore {
  __hasMore = false;
  __notices: NoticeModel[] = [];
  __totalCount = 0;
  __lastNoticeId = -1;
  __currentNoticeId = -1;
  __currentNotice: NoticeModel | null = null;
  __pinnedNotice: NoticeModel | null = null;
  repo: NoticeRepository = NoticeRepoImpl;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  initialize() {
    this.rootStore.talkStore?.addHandler('CREATE_NOTICE', (jsonMessage) => {
      // 새로 만든 공지가 isActive true 일 경우
      if (
        jsonMessage.roomId === this.rootStore.coreStore?.roomStore.currentRoomId
      ) {
        this.setPinnedNotice(new NoticeModel(jsonMessage as NoticeMessage));
        toggleNoticePreseneceState(
          this.rootStore.coreStore?.roomStore.currentRoomId as number,
          false,
        );
      }
    });
    this.rootStore.talkStore?.addHandler('DELETE_NOTICE', (jsonMessage) => {
      // Delete notice인 경우는 pin되어 있는 notice가 삭제되었을 경우
      if (
        jsonMessage.roomId ===
          this.rootStore.coreStore?.roomStore.currentRoomId &&
        this.pinnedNotice?.noticeId === (jsonMessage as NoticeMessage).noticeId
      ) {
        this.setPinnedNotice(null);
        toggleNoticePreseneceState(
          this.rootStore.coreStore?.roomStore.currentRoomId as number,
          false,
        );
      }
    });
    this.rootStore.talkStore?.addHandler('UPDATE_NOTICE', (jsonMessage) => {
      if (
        jsonMessage.roomId === this.rootStore.coreStore?.roomStore.currentRoomId
      ) {
        const notice = new NoticeModel(jsonMessage as NoticeMessage);

        if (notice.isActive) {
          this.setPinnedNotice(notice);
          toggleNoticePreseneceState(
            this.rootStore.coreStore?.roomStore.currentRoomId as number,
            false,
          );
        } else if (this.pinnedNotice?.noticeId === notice.noticeId) {
          this.setPinnedNotice(null);
        }
      }
    });
    this.rootStore.talkStore?.addHandler('PIN_NOTICE', (jsonMessage) => {
      // 룸 공지 버튼 클릭할 경우
      if (
        jsonMessage.roomId === this.rootStore.coreStore?.roomStore.currentRoomId
      ) {
        this.setPinnedNotice(new NoticeModel(jsonMessage as NoticeMessage));
        toggleNoticePreseneceState(
          this.rootStore.coreStore?.roomStore.currentRoomId as number,
          false,
        );
      }
    });
  }

  get currentNotice(): NoticeModel | null {
    return this.__currentNotice;
  }
  setCurrentNotice(notice: NoticeModel | null) {
    this.__currentNotice = notice;
  }

  get lastNoticeId(): number {
    return this.__lastNoticeId;
  }
  setLastNoticeId(noticeId: number) {
    this.__lastNoticeId = noticeId;
  }

  get currentNoticeId(): number {
    return this.__currentNoticeId;
  }
  setCurrentNoticeId(noticeId: number) {
    this.__currentNoticeId = noticeId;
  }

  get notices(): NoticeModel[] {
    return this.__notices;
  }
  setNotices(notices: NoticeModel[]) {
    this.__notices = notices;
  }

  get totalCount(): number {
    return this.__totalCount;
  }
  setTotalCount(totalCount: number) {
    this.__totalCount = totalCount;
  }

  get pinnedNotice(): NoticeModel | null {
    return this.__pinnedNotice;
  }
  setPinnedNotice(notice: NoticeModel | null) {
    this.__pinnedNotice = notice;
  }

  setHasMore(hasMore: boolean) {
    this.__hasMore = hasMore;
  }

  clear(): void {
    this.setNotices([]);
    this.setHasMore(false);
    this.setPinnedNotice(null);
    this.setCurrentNotice(null);
    this.setCurrentNoticeId(-1);
    this.setTotalCount(0);
  }

  getNotices = async ({ roomId }: { roomId: number }) => {
    const { status, data } = await this.repo.getNotices({ roomId });
    if (status === 'OK') {
      this.setHasMore(data.hasMore);
      const notices = data.notices.map((notice: NoticeInterface) => {
        return new NoticeModel(notice);
      });
      this.setNotices(notices);
      this.setTotalCount(data.totalCount);
    }
  };

  getNotice = async ({
    noticeId,
    roomId,
  }: {
    noticeId: number;
    roomId: number;
  }) => {
    const { status, data } = await this.repo.getNotice({ roomId, noticeId });
    if (status === 'OK') {
      this.setCurrentNotice(new NoticeModel(data as NoticeInterface));
      return data;
    }
    this.setCurrentNotice(null);
    return false;
  };

  createNotice = async ({
    noticeBody,
    isActive,
    roomId,
    roomName,
    nick,
    isVote = false,
  }: {
    noticeBody: DTO.NoticeCreateDto;
    isActive: boolean;
    roomId: number;
    roomName: string;
    nick: string;
    isVote?: boolean;
  }) => {
    const {
      status,
      // data
    } = await this.repo.createNotice({
      roomId,
      noticeBody,
      isActive,
      roomName,
      nick,
      isVote,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  updateNotice = async ({
    noticeId,
    noticeBody,
    isActive,
    roomId,
    roomName,
    nick,
  }: {
    noticeId: number;
    noticeBody: DTO.NoticeCreateDto;
    isActive: boolean;
    roomId: number;
    roomName: string;
    nick: string;
  }) => {
    const {
      status,
      // data
    } = await this.repo.updateNotice({
      roomId,
      noticeId,
      noticeBody,
      isActive,
      roomName,
      nick,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  deleteNotice = async ({
    noticeId,
    roomId,
  }: {
    noticeId: number;
    roomId: number;
  }) => {
    const {
      status,
      // data
    } = await this.repo.deleteNotice({
      roomId,
      noticeId,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  pinNotice = async ({
    roomId,
    noticeId,
    roomName,
    nick,
  }: {
    roomId: number;
    noticeId: number;
    roomName: string;
    nick: string;
  }) => {
    const { status, data } = await this.repo.pinNotice({
      roomId,
      noticeId,
      roomName,
      nick,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      this.setCurrentNotice(new NoticeModel(data as NoticeInterface));
      return true;
    }
    return false;
  };

  getPinnedNotice = async ({ roomId }: { roomId: number }) => {
    const { status, data } = await this.repo.getPinnedNotice({ roomId });
    if (status === 'OK' && data.noticeBody) {
      this.setPinnedNotice(new NoticeModel(data as NoticeInterface));
      return data;
    }
    this.setPinnedNotice(null);
    return null;
  };

  getNoticesWithLimit = async ({
    roomId,
    lastNoticeId,
    size,
  }: {
    roomId: number;
    lastNoticeId: number | null;
    size: number;
  }) => {
    const { status, data } = await this.repo.getNoticesWithLimit({
      roomId,
      lastNoticeId,
      size,
    });
    if (status === 'OK') {
      const resNotices = data.notices.map((notice: NoticeInterface) => {
        return new NoticeModel(notice);
      });
      if (resNotices.length > 0) {
        const newNotices = [...this.notices, ...resNotices];
        this.setNotices(newNotices);
        this.setHasMore(data.hasMore);
        this.setLastNoticeId(resNotices[resNotices.length - 1].noticeId);
      }
      return true;
    }
    return false;
  };

  getTotalNoticeCount = async ({ roomId }: { roomId: number }) => {
    const { status, data } = await this.repo.getTotalNoticeCount({ roomId });
    if (status === 'OK') {
      this.setTotalCount(data.totalCount);
      return true;
    }
    return false;
  };
}
