import { styled } from '@wapl/ui';

export const RoomMenuIcon = styled('div')`
  display: flex;
  align-items: center;
  margin-left: 12px;
  width: 20px;
  height: 20px;
`;

export const RoomMenuText = styled('span')`
  margin-left: 10px;
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
  padding: 0 0 0 0;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;
