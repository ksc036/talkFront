import * as S from './style';

interface RoomMenuItemsProps {
  icon: React.ReactNode;
  text: string;
  rightButton?: React.ReactNode;
  onClick?: () => void;
}
export const RoomMenuItem = (props: RoomMenuItemsProps) => {
  const { icon, text, rightButton, onClick } = props;
  return (
    <S.RoomMenuItemWrapper onClick={onClick}>
      {icon && <S.RoomMenuIcon>{icon}</S.RoomMenuIcon>}
      <S.RoomMenuText>{text}</S.RoomMenuText>
      {rightButton && <S.RoomMenuIcon>{rightButton}</S.RoomMenuIcon>}
    </S.RoomMenuItemWrapper>
  );
};
