import { styled, Mui } from '@wapl/ui';

export const TalkHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 52px;
`;

export const RoomInfoWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RoomToolbarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RoomTitle = styled('div')`
  font-family: Spoqa Han Sans Neo;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  margin-left: 12px;
`;

export const RoomMemberCount = styled('div')`
  color: #4f6bed;
  margin-left: 6px;
`;

export const RoomMenuIcon = styled('div')`
  width: 20px;
  height: 20px;
`;

export const RoomMenuTitle = styled('div')`
  width: 80px;
  height: 20px;
  color: #808688;
`;

export const RoomMenuItemWrapper = styled(Mui.MenuItem)`
  height: 44px;
  margin-left: 8px;
  margin-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MenuTitleWrapper = styled(Mui.MenuItem)`
  width: 34px;
  height: 15px;
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  pointer-events: none;
  margin-top: 6px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const Divider = styled('div')`
  height: 1px;
  background: ${({ theme }) => theme.Color.Gray[200]};
`;

// TODO: 스크롤바 안 보이게 설정 필요
export const MenuContentWrapper = styled('div')`
  padding-top: 10px;
  padding-bottom: 10px;
  max-height: fit-content;
`;

export const RoomMembersListWrapper = styled('div')`
  height: fit-content;
  max-height: 260px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const IconBtn = styled('button')`
  width: 20px;
  height: 20px;
  border: 0;
  background: none;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;
`;

export const WindowMenuIconWrapper = styled('button')`
  width: 20px;
  height: 20px;
  margin-left: 12px;
  border: 0;
  background: none;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;
`;

export const RoomMenuIconWrapper = styled('button')<{ hasText: boolean }>`
  ${({ hasText }) =>
    hasText
      ? 'width: 48px; height: 50px; border-radius: 8px;'
      : 'width: 28px; height: 28px; border-radius: 50%;'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: none;
  border: 0;
  padding: 0;
  gap: 3px;
  margin-left: -4px;
  margin-right: -4px;
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};

  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;

export const VerticalLine = styled('div')`
  margin-left: 12px;
  border: 0;
  background: none;
  flex-shrink: 0;
  padding: 0;
`;
