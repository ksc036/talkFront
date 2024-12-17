import { styled } from '@wapl/ui';

// Talk 게시판, Talk 첨부함, WAPL 앱과 같이 메뉴 모음들의 타이틀
export const MenuTitleWrapper = styled('div')`
  width: 320px;
  height: 28px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  pointer-events: none;
  background-color: ${({ theme }) => theme.Color.Background[2]};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const RoomMenuItemsWrapper = styled('ul')`
  list-style: none;
  padding: 0px;
  margin: 0px;
  background-color: ${({ theme }) => theme.Color.Background[2]};
`;

export const IconWrapper = styled('button')`
  width: 20px;
  height: 20px;
  border: 0;
  padding: 0;
  background: none;
  flex-shrink: 0;
  cursor: pointer;
`;
