import { styled } from '@wapl/ui';

export const Wrapper = styled('div')<{ isMine: boolean }>`
  display: flex;
  justify-content: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  padding-top: 8px;
`;

export const ReactionList = styled('div')<{ isMine: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 246px;
  justify-content: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
`;

export const ReactionWrapper = styled('button')<{
  isMine: boolean;
  borderColor?: string;
  backgroundColor?: string;
}>`
  display: flex;
  align-items: center;
  height: 24px;
  width: 38px;
  padding: 4px 6px;
  border: ${({ isMine, borderColor }) =>
    isMine ? `1px solid ${borderColor}` : '1px solid transparent'};
  background: ${({ theme, isMine, backgroundColor }) =>
    isMine ? backgroundColor : theme.Color.White[100]};
  border-radius: 12px;
`;

export const EmojiWrapper = styled('div')`
  width: 16px;
  height: 16px;
  border: 0;
  background: transparent;
  padding: 0;
  overflow: hidden;
`;

export const ReactionCount = styled('span')<{ color?: string }>`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ color }) => color};
  margin-left: 2px;
`;

export const ReactionListButton = styled('button')`
  width: 32px;
  height: 24px;
  border: 0;
  padding: 4px 6px;
  background: ${({ theme }) => theme.Color.Gray[50]};
  border-radius: 12px;
  &:hover {
    background: ${({ theme }) => theme.Color.Gray[100]};
  }
  &:active {
    background: ${({ theme }) => theme.Color.Gray[200]};
    border: 1px solid ${({ theme }) => theme.Color.Black[20]};
  }
`;
