import { styled } from '@wapl/ui';

export const RoomMenuIcon = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

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
  justify-content: right;
  height: 20px;
  width: 100%;
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
