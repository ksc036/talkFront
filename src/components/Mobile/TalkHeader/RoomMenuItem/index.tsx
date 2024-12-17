import * as S from './style';

interface RoomMenuItemsProps {
  icon: React.ReactNode;
  text: string;
  rightButton?: React.ReactNode;
  onClick?: () => void;
  rightButtonStyle?: React.CSSProperties;
}
export const RoomMenuItem = (props: RoomMenuItemsProps) => {
  const { icon, text, rightButton, onClick, rightButtonStyle } = props;
  return (
    <S.RoomMenuItemWrapper onClick={onClick}>
      {icon && <S.RoomMenuIcon>{icon}</S.RoomMenuIcon>}
      <S.RoomMenuText>{text}</S.RoomMenuText>
      {rightButton && (
        <S.RoomMenuIcon style={rightButtonStyle || { marginLeft: 'auto' }}>
          {rightButton}
        </S.RoomMenuIcon>
      )}
    </S.RoomMenuItemWrapper>
  );
};
