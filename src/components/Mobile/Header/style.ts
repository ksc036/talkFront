import { styled, css } from '@wapl/ui';

export const ClearButton = css`
  padding: 0;
  outline: inherit;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
`;

export const HeaderContainer = styled.header`
  box-sizing: border-box;
  width: 100%;
  position: sticky;
  top: 0;
  height: 56px;
  padding: 0px 16px 0px 16px;
  z-index: 20;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const FoodistHeaderWrapper = styled.header`
  display: flex;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  flex-direction: column;
`;

export const AppBarWrapper = styled.span`
  display: flex;
  height: 56px;
  justify-content: center;
`;

export const SearchButton = styled.span`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 30px;
`;

export const HeaderSection = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
`;

export const HeaderMenuItemList = styled.ul`
  all: unset;
  display: flex;
  gap: 10px;
`;

export const HeaderMenuItem = styled.li<{ isActive?: boolean }>`
  ${({ theme: { Font } }) => Font.Text.xl.Medium};
  color: ${({ isActive, theme: { Color } }) =>
    isActive ? Color.Gray[900] : Color.Gray[400]};
`;

export const HeaderMenuTitle = styled.strong`
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.xl.Medium};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
export const HomeBtn = styled.button`
  ${ClearButton}
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: ${({ theme: { Color } }) => Color.Gray[100]};
  border-radius: 50%;
`;

export const IconWrapper = styled(`div`)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  :hover {
    background: theme.Color.Gray[100];
    border-radius: '50%';
  }
`;

export const OpenRoomHeaderNav = styled('span')`
  box-sizing: border-box;
  display: flex;
  padding: 14px 16px;
  height: 48px;
  justify-content: space-between;
`;

export const OpenRoomHeaderNavContentWrapper = styled('span')`
  display: flex;
  gap: 8px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
