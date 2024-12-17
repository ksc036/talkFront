import { Icon, styled } from '@wapl/ui';

type MiniChatHeaderWrapperProps = {
  backgroundColor: string;
};

type RoomInfoWrapperProps = {
  clickable?: boolean;
};

type RoomMemberCountProps = {
  color: string;
};

export const MiniChatHeaderWrapper = styled('div')<MiniChatHeaderWrapperProps>`
  width: 100vw;
  height: 62px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const RoomInfoWrapper = styled('div')<RoomInfoWrapperProps>`
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 0 1 auto;
  cursor: ${({ clickable }) => clickable && 'pointer'};
`;

export const MeFillIcon = styled(Icon.MeFill)`
  margin-right: 6px;
`;

export const RoomProfileWrapper = styled('div')`
  display: flex;
  align-items: center;
  margin: 0px;
  margin-right: 12px;
`;

export const RoomName = styled('strong')`
  ${({ theme: { Font } }) => Font.Text.l.Bold};
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 0 1 auto;
`;

export const RoomMemberCount = styled('p')<RoomMemberCountProps>`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  color: ${({ color }) => color};
  margin-left: 6px;
  margin-right: 8px;
`;

export const KeywordSearchButton = styled('button')<{ hasText: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: none;
  border: 0;
  padding: 0;
  gap: 3px;
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};

  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;
