import { MouseEvent } from 'react';

import { RoomMember } from '@wapl/core';

import UserListItems from '@/components/Common/UserListItems';
import { useStore } from '@/stores';

import * as S from './styles';

interface RoomInfoMenuItemProps {
  roomMember: RoomMember;
  myself?: boolean;
}
const RoomInfoMenuItem = (props: RoomInfoMenuItemProps) => {
  const { roomMember, myself } = props;
  const { uiStore } = useStore();

  const handleProfileClick = async (event: MouseEvent<HTMLElement>) => {
    uiStore.setSelectedPersonaId(roomMember.personaId);
    uiStore.setDesktopProfileAnchorEl(event.currentTarget);
    uiStore.setDesktopProfilePosition('roomMenuList');
  };

  return (
    <S.RoomInfoMenuItem>
      <UserListItems
        personaId={roomMember.personaId}
        imgSrc={roomMember.profileImageFilepath ?? ''}
        isMine={myself ?? false}
        nickName={roomMember.personaNick}
        onClick={handleProfileClick}
      />
    </S.RoomInfoMenuItem>
  );
};

export default RoomInfoMenuItem;
