import { TimeStampString } from '@/@types';

export interface VoteRequestDTO {
  nick?: string;
  roomName?: string;
  voteTitle?: string;
  voteEnterTime?: number;
  voteItems?: { voteItemId: number; itemContent: string }[];
  voteItemIds?: number[];
  voteType?: number;
  deadline?: TimeStampString | null;
}
