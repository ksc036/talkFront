import { styled } from '@wapl/ui';

export const Wrapper = styled('li')<{ mainColor: string; isVoted: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  user-select: none;
  &:hover {
    background-color: ${({ theme: { Color } }) => Color.Black[4]};
  }
  &:active {
    background-color: ${({ theme: { Color } }) => Color.Black[6]};
  }
  border-radius: 8px;
  min-height: 68px;
  margin: 0 20px 8px 20px;
  border: ${({ mainColor }) => `1px ${mainColor} solid`};
  background-color: ${({ isVoted, theme }) =>
    isVoted ? '#F8F9FA' : theme.Color.White[100]};
`;

export const ContentWrapper = styled('div')<{
  isClosedVote: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${({ isClosedVote, theme: { Color } }) =>
    isClosedVote ? Color.Gray[400] : Color.Gray[900]};
`;

export const DescWrapper = styled('div')<{
  isClosedVote: boolean;
}>`
  display: flex;
  align-items: center;
  color: ${({ isClosedVote, theme: { Color } }) =>
    isClosedVote ? Color.Gray[400] : Color.Gray[600]};
`;

export const VoteTitle = styled('strong')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 영역 내의 컨텐츠의 최대 라인수를 결정 */
  -webkit-box-orient: vertical;
  font-size: 16px;
  width: 100%;
`;

export const ParticipantListBadge = styled('span')`
  margin-right: 4px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
`;

export const VotingRegistrationDate = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
`;

export const VotingCheckedIcon = styled('span')`
  display: inline-block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: auto;
`;
