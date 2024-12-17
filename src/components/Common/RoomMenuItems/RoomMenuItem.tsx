import { isMobile } from '@/utils';

import * as S from './style';

interface RoomMenuItemsProps {
  icon: React.ReactNode;
  text?: string;
  rightButton?: React.ReactNode;
  onClick?: () => void;
}

export const RoomMenuItem = (props: RoomMenuItemsProps) => {
  const { icon, text, rightButton, onClick } = props;

  if (isMobile())
    return (
      <S.RoomMenuItemWrapper onClick={onClick}>
        <div style={{ display: 'flex' }}>
          {icon && <S.RoomMenuIcon>{icon}</S.RoomMenuIcon>}
          <S.RoomMenuText>{text}</S.RoomMenuText>
        </div>
        <S.RoomMenuIcon>{rightButton}</S.RoomMenuIcon>
      </S.RoomMenuItemWrapper>
    );
  return (
    <S.RoomMenuIconWrapper onClick={onClick}>{icon}</S.RoomMenuIconWrapper>
  );
};
