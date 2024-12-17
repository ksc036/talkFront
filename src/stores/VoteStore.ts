import { makeAutoObservable, IObservableArray } from 'mobx';

import { JsonMessage } from '@/@types';
import { VoteRequestDTO } from '@/@types/VoteDTO';
import { INFINITE_SCROLL_SIZE } from '@/constants/common';
import { VoteRepository, VoteRepoImpl } from '@/repositories';

import {
  VoteInterface,
  VoteModel,
  VoteItemModel,
  VoteImage,
  VoteUnloadImage,
} from './../models/VoteModel';
import { RootStore } from './RootStore';

export class VoteStore {
  __openVotes: VoteModel[] = [];
  __closedVotes: VoteModel[] = [];
  repo: VoteRepository = VoteRepoImpl;
  __lastOpenVotesId = -1;
  __lastClosedVotesId = -1;
  __hasMoreOpenVotes = false;
  __hasMoreClosedVotes = false;
  __totalOpenVotes = 0;
  __totalClosedVotes = 0;
  currentVoteId = -1;
  currentVote: VoteModel | null = null;
  voteTargets: IObservableArray<VoteItemModel['voteItemId']> =
    [] as unknown as IObservableArray<VoteItemModel['voteItemId']>;
  rootStore: RootStore;
  uploadImageList: VoteImage[] = [];
  unloadImageList: VoteUnloadImage[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  initialize() {
    this.rootStore.talkStore?.addHandler('UPDATE_VOTE', async (jsonMessage) => {
      await this.handleVoteClientMessage(jsonMessage);
    });
    this.rootStore.talkStore?.addHandler('DO_VOTE', async (jsonMessage) => {
      await this.handleVoteClientMessage(jsonMessage);
    });
    this.rootStore.talkStore?.addHandler('DELETE_VOTE', async (jsonMessage) => {
      await this.handleVoteClientMessage(jsonMessage);
    });
    this.rootStore.talkStore?.addHandler('END_VOTE', async (jsonMessage) => {
      await this.handleVoteClientMessage(jsonMessage);
    });
  }

  clear = () => {
    this.setLastOpenVotesId(-1);
    this.setLastClosedVotesId(-1);
    this.setClosedVotes([]);
    this.setOpenVotes([]);
    this.setHasMoreOpenVotes(false);
    this.setHasMoreClosedVotes(false);
  };

  get openVotes(): VoteModel[] {
    return this.__openVotes;
  }
  setOpenVotes(openVotes: VoteModel[]) {
    this.__openVotes = openVotes;
  }

  get closedVotes(): VoteModel[] {
    return this.__closedVotes;
  }
  setClosedVotes(closedVotes: VoteModel[]) {
    this.__closedVotes = closedVotes;
  }

  get lastOpenVotesId(): number {
    return this.__lastOpenVotesId;
  }
  setLastOpenVotesId(openVotesId: number) {
    this.__lastOpenVotesId = openVotesId;
  }

  get lastClosedVotesId(): number {
    return this.__lastClosedVotesId;
  }
  setLastClosedVotesId(closedVotesId: number) {
    this.__lastClosedVotesId = closedVotesId;
  }

  get hasMoreOpenVotes(): boolean {
    return this.__hasMoreOpenVotes;
  }
  setHasMoreOpenVotes(hasMoreOpenVotes: boolean) {
    this.__hasMoreOpenVotes = hasMoreOpenVotes;
  }

  get hasMoreClosedVotes(): boolean {
    return this.__hasMoreClosedVotes;
  }
  setHasMoreClosedVotes(hasMoreClosedVotes: boolean) {
    this.__hasMoreClosedVotes = hasMoreClosedVotes;
  }

  get totalOpenVotes(): number {
    return this.__totalOpenVotes;
  }
  setTotalOpenVotes(totalOpenVotes: number) {
    this.__totalOpenVotes = totalOpenVotes;
  }

  get totalClosedVotes(): number {
    return this.__totalClosedVotes;
  }
  setTotalClosedVotes(totalClosedVotes: number) {
    this.__totalClosedVotes = totalClosedVotes;
  }

  getVotes = async ({ roomId, size }: { roomId: number; size: number }) => {
    const { status, data } = await this.repo.getVotes({
      roomId,
      ...(this.lastOpenVotesId > 0 && { lastVoteId: this.lastOpenVotesId }),
      size,
    });
    if (status === 'OK') {
      const resOpenVotes = data.voteList.map(
        (vote: VoteInterface) => new VoteModel(vote),
      );

      if (resOpenVotes.length > 0) {
        const newOpenVotes = [...this.__openVotes, ...resOpenVotes];
        this.setOpenVotes(newOpenVotes);
        this.setHasMoreOpenVotes(data.hasMore);
        this.setLastOpenVotesId(resOpenVotes[resOpenVotes.length - 1].voteId);
        return true;
      }
      return false;
    }
  };

  getClosedVotes = async ({
    roomId,
    size,
  }: {
    roomId: number;
    size: number;
  }) => {
    const { status, data } = await this.repo.getClosedVotes({
      roomId,
      ...(this.lastClosedVotesId > 0 && { lastVoteId: this.lastClosedVotesId }),
      size,
    });
    if (status === 'OK') {
      const resClosedVotes = data.voteList.map(
        (vote: VoteInterface) => new VoteModel(vote),
      );

      if (resClosedVotes.length > 0) {
        const newClosedVotes = [...this.__closedVotes, ...resClosedVotes];
        this.setClosedVotes(newClosedVotes);
        this.setHasMoreClosedVotes(data.hasMore);
        this.setLastClosedVotesId(
          resClosedVotes[resClosedVotes.length - 1].voteId,
        );
        return true;
      }
      return false;
    }
  };

  getVote = async ({ voteId }: { voteId: number }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status, data } = await this.repo.getVote({ roomId, voteId });
    if (status === 'OK') {
      this.setCurrentVoteId(voteId);
      this.setCurrentVote(new VoteModel(data as VoteModel));
      this.uploadImageList = [];
      this.unloadImageList = [];
      return this.currentVote;
    }
  };

  createVote = async ({ voteDTO }: { voteDTO: VoteRequestDTO }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status, data } = await this.repo.createVote({
      roomId,
      voteDTO,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      this.setCurrentVoteId(data.voteId);
      return true;
    }
    return false;
  };

  deleteVote = async ({
    voteId,
    nick,
    voteDTO,
  }: {
    voteId: number;
    nick: string;
    voteDTO: VoteRequestDTO;
  }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status } = await this.repo.deleteVote({
      roomId,
      voteId,
      voteDTO,
      nick,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  editVote = async ({
    voteDTO,
    voteId,
  }: {
    voteDTO: VoteRequestDTO;
    voteId: number;
  }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status, data } = await this.repo.editVote({
      roomId,
      voteId,
      voteDTO,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK' && data) {
      return true;
    }
    return false;
  };

  vote = async ({
    voteId,
    voteRequestDTO,
  }: {
    voteId: number;
    voteRequestDTO: VoteRequestDTO;
  }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status } = await this.repo.vote({
      roomId,
      voteId,
      voteRequestDTO,
    });
    if (status === 'OK') return true;
    return false;
  };

  closeVote = async ({
    voteId,
    nick,
    voteDTO,
  }: {
    voteId: number;
    nick: string;
    voteDTO: VoteRequestDTO;
  }) => {
    const roomId = this.rootStore.coreStore?.roomStore.currentRoomId as number;
    const { status } = await this.repo.closeVote({
      roomId,
      nick,
      voteId,
      voteDTO,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  handleVoteClientMessage = async (jsonMessage: JsonMessage) => {
    switch (this.rootStore.uiStore.voteDialogMode) {
      case 'vote':
        if ('voteItems' in jsonMessage && jsonMessage.voteItems) {
          jsonMessage.voteItems.map((jsonItems) => {
            this.currentVote?.voteItems.map((currentItems) => {
              if (jsonItems.voteItemId === currentItems.voteItemId) {
                jsonItems.isVoted = currentItems.isVoted;
              }
            });
          });
        }
        this.setCurrentVote(new VoteModel(jsonMessage as VoteModel));
        break;
      case 'allVote':
        if (
          this.rootStore.coreStore?.roomStore.currentRoomId &&
          this.rootStore.coreStore?.roomStore.currentRoomId > 0
        ) {
          this.clear();
          await this.getVotes({
            roomId: this.rootStore.coreStore?.roomStore.currentRoomId as number,
            size: INFINITE_SCROLL_SIZE,
          });
          await this.getClosedVotes({
            roomId: this.rootStore.coreStore?.roomStore.currentRoomId as number,
            size: INFINITE_SCROLL_SIZE,
          });
        }
        break;
    }
  };

  getFirstRank = (voteItems: VoteItemModel[]) => {
    let voteResult: number[] = [];
    let maxCount = 1;
    voteItems.forEach((voteItem) => {
      if (voteItem.voteCount === maxCount) {
        voteResult.push(voteItem.voteItemId);
      } else if (voteItem.voteCount > maxCount) {
        voteResult = [voteItem.voteItemId];
        maxCount = voteItem.voteCount;
      }
    });
    return voteResult;
  };

  getTotalVotesCount = async ({
    roomId,
    isOpen,
  }: {
    roomId: number;
    isOpen: string;
  }) => {
    const { status, data } = await this.repo.getTotalVotesCount({
      roomId,
      isOpen,
    });
    if (status === 'OK') {
      if (isOpen === 'open') {
        this.setTotalOpenVotes(data.totalCount);
      } else {
        this.setTotalClosedVotes(data.totalCount);
      }
      return true;
    }
  };

  setCurrentVote(vote: VoteModel | null) {
    this.currentVote = vote;
  }

  setCurrentVoteItem(imageItem: VoteItemModel) {
    this.currentVote?.voteItems.map((item) =>
      item.voteItemId === imageItem.voteItemId
        ? (item.imageId = imageItem.imageId)
        : item,
    );
  }

  setCurrentVoteId(voteId: number) {
    this.currentVoteId = voteId;
  }

  setVoteTarget = (voteItemIds: VoteItemModel['voteItemId'][]) => {
    this.voteTargets.replace(voteItemIds);
  };
}
