import { styled, Button } from '@wapl/ui';

export const RoomMenuIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 100%;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
`;

export const RoomMenuFooterWrapper = styled('div')`
  height: 56px;
  display: grid;
  grid-template-columns: 1fr fit-content(100%);
  align-items: center;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  padding-left: 18.08px;
  padding-right: 18.58px;
`;

export const RoomFooterMenuIconWrapper = styled('div')`
  display: flex;
  align-items: center;
  height: 20px;
  > div {
    margin-left: 4px;
  }
  justify-self: end;
`;

export const ExitTitleWrapper = styled('span')`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: Spoqa Han Sans Neo;
  margin-right: auto;
  padding: 4px;
  border-radius: 8px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  > span {
    margin-left: 5px;
  }
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
`;

export const DialogWrapper = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const ButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 0 20px;
  margin-top: auto;
`;

export const StyledButton = styled(Button)`
  min-width: 154px;
  margin-right: 12px;
  font-size: 13px;
  &: last-of-type {
    margin-right: 0;
  }
`;
