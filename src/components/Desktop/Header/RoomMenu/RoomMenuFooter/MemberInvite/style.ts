import { styled } from '@wapl/ui';

export const RoomMenuFooterWrapper = styled('div')`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  padding-left: 18.08px;
  padding-right: 18.58px;
`;

export const RoomFooterMenuIconWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 20px;
  > div {
    margin-left: 12px;
  }
`;

export const ExitTitleWrapper = styled('span')`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: Spoqa Han Sans Neo;
  color: ${({ theme }) => theme.Color.Gray[900]};
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  > span {
    margin-left: 5px;
  }
`;

export const MemberIcon = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 14px;
`;

export const RoomMenuText = styled('span')`
  display: flex;
  align-items: center;
  width: 280px;
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const MemberItemWrapper = styled('li')`
  height: 52px;
  display: flex;
  gap: 12px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  background-color: ${({ theme }) => theme.Color.White[100]};
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;
