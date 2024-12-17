import { MouseEvent } from 'react';

import { useCoreStore, RoomMember } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import UserListItems from '@/components/Common/UserListItems';
import { useStore } from '@/stores';

import * as S from './style';

interface MemberProps {
  persona: RoomMember;
}

export const Member = observer((props: MemberProps) => {
  const { persona } = props;
  const { userStore } = useCoreStore();
  const { uiStore } = useStore();

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    uiStore.setSelectedPersonaId(persona.personaId);
    uiStore.setDesktopProfileAnchorEl(event.currentTarget);
    uiStore.setDesktopProfilePosition('roomMenuList');
  };
  return (
    <S.MemberItemWrapper>
      <UserListItems
        personaId={persona.personaId}
        imgSrc={persona.profileImageFilepath ?? ''}
        isMine={(userStore.selectedPersona?.id as number) === persona.personaId}
        nickName={persona.personaNick}
        style={{
          height: '52px',
        }}
        onClick={handleProfileClick}
      />
    </S.MemberItemWrapper>
  );
});
