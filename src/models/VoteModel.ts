import { useCoreStore, PersonaModel } from '@wapl/core';
import { makeAutoObservable } from 'mobx';

import { timeStampFormatForVoteDeadLine } from '@/utils';
import { mergeObject } from '@/utils/mobx';
import * as T from '@types';

const isAnony = 1;
const isMulti = 2;
const isNotice = 4;
export const MAX_VOTEITEM_LENGTH = 10;

const defaultVoteItem = {
  voteId: 0,
  personaId: 0,
  roomId: 0,
  voteType: 0,
  title: '',
  isDeleted: false,
  isVoted: false,
  closedAt: '',
  updatedAt: '',
  createdAt: '',
  deadline: undefined,
  votedPersonaIds: [],
  voteItems: [
    {
      voteItemId: 0,
      itemContent: '',
      voteCount: 0,
      personaIds: [],
      hasFile: false,
      isVoted: false,
    },
    {
      voteItemId: 0,
      itemContent: '',
      voteCount: 0,
      personaIds: [],
      hasFile: false,
      isVoted: false,
    },
  ],
};

export interface VoteItemModel {
  voteItemId: number;
  itemContent: string;
  voteCount: number;
  personaIds: number[];
  hasFile: boolean;
  imageId?: number;
  isVoted: boolean;
}
export interface VoteUnloadImage {
  orderNum: number;
}
export interface VoteImage {
  orderNum: number;
  imageId: File;
}

export interface VoteInterface {
  voteId: number;
  personaId: number;
  roomId: number;
  voteType: number;
  title: string;
  isDeleted: boolean;
  isVoted: boolean;
  closedAt: T.TimeStampString;
  updatedAt: T.TimeStampString;
  createdAt: T.TimeStampString;
  deadline?: T.TimeStampString;
  voteItems: VoteItemModel[];
  votedPersonaIds: number[];
}

export class VoteModel implements VoteInterface {
  voteId: number;
  personaId: number;
  roomId: number;
  voteType: number;
  title: string;
  isDeleted: boolean;
  isVoted: boolean;
  closedAt: T.TimeStampString;
  updatedAt: T.TimeStampString;
  createdAt: T.TimeStampString;
  deadline?: T.TimeStampString;
  voteItems: VoteItemModel[];
  votedPersonaIds: number[];

  constructor(vote: VoteInterface = defaultVoteItem) {
    this.voteId = vote.voteId;
    this.personaId = vote.personaId;
    this.roomId = vote.roomId;
    this.voteType = vote.voteType;
    this.title = vote.title;
    this.isDeleted = vote.isDeleted;
    this.isVoted = vote.isVoted;
    this.closedAt = vote.closedAt;
    this.updatedAt = vote.updatedAt;
    this.createdAt = vote.createdAt;
    this.deadline = vote.deadline;
    this.voteItems = vote.voteItems;
    this.votedPersonaIds = vote.votedPersonaIds || [];
    makeAutoObservable(this);
  }

  get numberUsers(): number {
    return this.votedPersonaIds.length;
  }

  get isAnonymous(): boolean {
    return this.voteType & isAnony ? true : false;
  }

  get isMultiple(): boolean {
    return this.voteType & isMulti ? true : false;
  }

  get isRoomNotice(): boolean {
    return this.voteType & isNotice ? true : false;
  }

  get isDeadLine(): boolean {
    return this.deadline === undefined ? false : true;
  }

  get isClosed(): boolean {
    return !!this.closedAt;
  }

  get createUser(): PersonaModel {
    const { roomStore, personaStore } = useCoreStore();

    const personaList = roomStore
      .getRoomMemberList(roomStore.currentRoomId as number)
      .map((roomMember) => {
        return personaStore.getPersona(roomMember.personaId);
      }) as PersonaModel[];

    const user = personaList.find(
      (member: PersonaModel) => member.id === this.personaId,
    ) as PersonaModel;
    return user;
  }

  get formattedDeadline(): string {
    if (this.deadline === undefined) return '';
    else if (this.isClosed)
      return `${timeStampFormatForVoteDeadLine(
        this.closedAt,
        'MM월 DD일 a hh:mm',
      )} 종료`;
    return `${timeStampFormatForVoteDeadLine(
      this.deadline,
      'MM월 DD일 a hh:mm',
    )} 까지`;
  }

  get formattedCreateAt(): string {
    return `${timeStampFormatForVoteDeadLine(
      this.createdAt,
      'MM월 DD일 a hh:mm',
    )} 등록`;
  }

  update(value: Partial<VoteModel>): void {
    mergeObject(this, { ...value });
  }

  addItem = (VoteItem: VoteItemModel): void => {
    if (this.voteItems.length < MAX_VOTEITEM_LENGTH) {
      this.voteItems.push(VoteItem);
    }
  };

  updateItem = (idx: number, value: Partial<VoteItemModel>): void => {
    mergeObject(this.voteItems[idx], { ...value });
  };

  deleteItem = (idx: number) => {
    if (this.voteItems[idx]) {
      this.voteItems.splice(idx, 1);
    }
  };

  updateImage = (idx: number, documentId: number): void => {
    this.voteItems[idx] = { ...this.voteItems[idx], imageId: documentId };
  };

  deleteImage = (idx: number): void => {
    const { imageId, ...newVoteItem } = this.voteItems[idx];
    this.voteItems[idx] = newVoteItem;
  };
}
