import React, { MouseEvent, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useCoreStore, getDefaultImageURL } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import { isMobile, isBot } from '@/utils';

import * as S from './styled';

interface UserProfileProps {
  personaId: number;
  size?: number;
}

const UserProfile = observer((props: UserProfileProps) => {
  const { personaId } = props;

  const { roomStore, personaStore } = useCoreStore();
  const { uiStore, configStore } = useStore();

  let navigate: NavigateFunction | null = null;

  if (isMobile()) {
    navigate = useNavigate();
  }

  const roomMember = roomStore
    .getRoomById(roomStore.currentRoomId as number)
    ?.getMemberById(personaId);

  const persona = personaStore.getPersona(personaId);

  const imageSrc = roomMember?.profileImageFilepath
    ? roomMember.profileImageFilepath
    : persona?.profileImageUrl ?? '';

  useEffect(() => {
    if (!persona) {
      personaStore.fetchPersona({ personaId });
    }
  }, []);

  const handleOnClickProfile = (event: MouseEvent<HTMLElement>) => {
    if (persona && !isBot(personaId)) {
      if (isMobile() && navigate) {
        uiStore.setSelectedPersonaId(personaId);
        navigate(`/talk/${roomStore.currentRoomId}#profile`);
      } else {
        uiStore.setSelectedPersonaId(persona.id);
        uiStore.setDesktopProfileAnchorEl(event.currentTarget);
        uiStore.setDesktopProfilePosition('messageProfile');
      }
    }
  };

  const defaultImage = getDefaultImageURL({
    type: 'PROFILE',
    personaId: personaId as number,
  });

  return (
    <S.AvatarWrapper clickable={configStore.ProfileDialogVisible}>
      <Avatar
        onClick={handleOnClickProfile}
        size={32}
        imgSrc={imageSrc !== '' ? imageSrc : defaultImage}
      />
    </S.AvatarWrapper>
  );
});

export default UserProfile;
