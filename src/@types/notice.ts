import { VoteBody, VoteStateType } from './message';

export type NoticeModeType = 'list' | 'read' | 'create' | 'update';

export type NoticeBody = {
  content?: string;
  voteId?: number;
  voteBody?: VoteBody;
  voteStateType?: VoteStateType;
};
