import { styled } from '@wapl/ui';

export const InfiniteScrollWrapper = styled('div')`
  overflow: auto;
  overflow-y: 'scroll';
  height: 100%;

  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: none;
    border-radius: 4px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const ItemWrapper = styled('div')`
  display: flex;
  padding: 13px 8px;
  flex-direction: column;
`;

export const ItemUserListWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
`;

export const NoUser = styled(ItemUserListWrapper)`
  ${({ theme }) => theme.Font.Text.m.Regular};
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme: { Color } }) => Color.Gray[500]};
  padding: 10px 0;
`;

export const ItemUserProfile = styled('div')`
  overflow: hidden;
  margin-left: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ItemUserName = styled('div')`
  font-size: 16px;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;
