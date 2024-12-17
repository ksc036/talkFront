import { styled, Mui } from '@wapl/ui';

export const RoomMenuIcon = styled('div')`
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-right: 14px;
`;

export const RoomMenuText = styled('span')`
  font-family: 'Spoqa Han Sans Neo';
  display: flex;
  align-items: center;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const RoomMenuItemWrapper = styled('li')`
  height: 44px;
  list-style: none;
  padding: 0 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.Color.White[100]};
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;

export const TalkBoardItemWrapper = styled(Mui.MenuItem)`
  width: 144px;
  height: 44px;
  display: flex;
  align-items: center;
`;

export const RoomMenuIconWrapper = styled('button')`
  width: 28px;
  height: 28px;
  margin-left: 4px;
  border: 0;
  background: none;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;
  :hover {
    width: 28px;
    height: 28px;
    background: ${({ theme }) => theme.Color.Black[6]};
    border-radius: 23px;
  }
`;
