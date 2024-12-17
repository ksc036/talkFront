import { styled, Mui } from '@wapl/ui';

export const RoomMenuIcon = styled('div')`
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
`;

export const RoomMenuText = styled('span')`
  margin-left: 10px;
  width: 280px;
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const RoomMenuItemWrapper = styled('li')`
  height: 44px;
  list-style: none;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.Color.Background[2]};
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
  }
`;

export const TalkBoardItemWrapper = styled(Mui.MenuItem)`
  width: 144px;
  height: 44px;
  display: flex;
  align-items: center;
`;
