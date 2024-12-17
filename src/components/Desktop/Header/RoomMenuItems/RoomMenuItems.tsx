import * as S from '@desktop/Header/RoomMenuItems/style';

interface RoomMenuItemsProps {
  title: string;
  menuItems: React.ReactNode[];
}
export const RoomMenuItems = (props: RoomMenuItemsProps) => {
  const { title, menuItems } = props;
  return (
    <>
      {title && <S.MenuTitleWrapper>{title}</S.MenuTitleWrapper>}
      <S.RoomMenuItemsWrapper>{menuItems}</S.RoomMenuItemsWrapper>
    </>
  );
};
