import { styled, Mui } from '@wapl/ui';

import { isMobile } from '@/utils';

export const RoomMenuItemWrapper = styled(Mui.MenuItem)`
  height: 44px;
  margin-left: 8px;
  margin-right: 8px;
  display: flex;
  justify-content: space-between;
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

// Talk 게시판, Talk 첨부함, WAPL 앱과 같이 메뉴 모음들의 타이틀
export const MenuTitleWrapper = styled('strong')`
  font-family: 'Spoqa Han Sans Neo';
  margin-left: 20px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  pointer-events: none;
  background-color: ${({ theme }) => theme.Color.White[100]};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const RoomMenuItemsWrapper = styled('ul')`
  list-style: none;
  padding: 0 0 0 0;
  margin: 6px 0px 7px 0px;
  background-color: ${({ theme }) => theme.Color.White[100]};
`;

interface RoomMenuItemsProps {
  title?: string;
  menuItems: React.ReactNode[];
}

// 서울시 교육청 나가는 용도
export const RoomMenuItems = (props: RoomMenuItemsProps) => {
  const { title, menuItems } = props;

  if (isMobile())
    return (
      <>
        <MenuTitleWrapper>{title}</MenuTitleWrapper>
        <RoomMenuItemsWrapper>{menuItems}</RoomMenuItemsWrapper>
      </>
    );
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>{menuItems}</div>
  );
};
