import { RoomMember, useCoreStore } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';

import * as S from './styled';

interface UnreadUserItemProps {
  roomMember: RoomMember;
}

const UnreadUserItem = observer((props: UnreadUserItemProps) => {
  const { roomMember } = props;
  const { personaStore } = useCoreStore();
  const { uiStore } = useStore();

  const handleOnClickProfile = async () => {
    await personaStore.fetchPersona({
      personaId: roomMember.personaId,
    });

    const persona = personaStore.getPersona(roomMember.personaId);

    if (persona) {
      uiStore.setSelectedPersona(persona);
    }
  };

  return (
    <S.UnreadUserItem key={roomMember.personaId} onClick={handleOnClickProfile}>
      <Avatar size={36} imgSrc={roomMember.profileImageFilepath ?? ''} />
      <S.ListItemText>{roomMember.personaNick}</S.ListItemText>
    </S.UnreadUserItem>
  );
});
export default UnreadUserItem;
