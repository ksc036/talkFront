import { styled } from '@wapl/ui';

// Talk 게시판, Talk 첨부함, WAPL 앱과 같이 메뉴 모음들의 타이틀
export const MenuTitleWrapper = styled('strong')`
  font-family: 'Spoqa Han Sans Neo';
  margin-left: 20px;
  margin-top: 6px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  pointer-events: none;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const RoomMenuItemsWrapper = styled('ul')`
  list-style: none;
  padding: 0 0 0 0;
  margin: 6px 8px 0px 8px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const RoomMenuButtonsWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0 0 0 0;
  margin: 10px 8px 7px 8px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;
