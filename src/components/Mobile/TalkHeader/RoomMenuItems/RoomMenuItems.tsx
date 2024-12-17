import * as S from './style';

interface RoomMenuItemsProps {
  title?: string;
  menuItems: React.ReactNode[];
}
export const RoomMenuItems = (props: RoomMenuItemsProps) => {
  const { title, menuItems } = props;
  return (
    <>
      <S.MenuTitleWrapper>{title}</S.MenuTitleWrapper>
      <S.RoomMenuItemsWrapper>{menuItems}</S.RoomMenuItemsWrapper>
    </>
  );
};

export const RoomMenuButtons = (props: RoomMenuItemsProps) => {
  const { title, menuItems } = props;
  return (
    <div style={{ marginTop: '7px' }}>
      <S.MenuTitleWrapper>{title}</S.MenuTitleWrapper>
      <S.RoomMenuButtonsWrapper>{menuItems}</S.RoomMenuButtonsWrapper>
    </div>
  );
};

export const VerticalRoomMenuButtons = (props: RoomMenuItemsProps) => {
  const { title, menuItems } = props;
  return (
    <div style={{ marginTop: '7px' }}>
      <S.MenuTitleWrapper>{title}</S.MenuTitleWrapper>
      <S.RoomMenuButtonsWrapper style={{ flexDirection: 'column', gap: 0 }}>
        {menuItems}
      </S.RoomMenuButtonsWrapper>
    </div>
  );
};
