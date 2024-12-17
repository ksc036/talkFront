import React, { MouseEvent } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import * as S from './styled';

interface MentionProps {
  userName: string;
  personaId: number;
  getMention?: boolean;
  isMine?: boolean;
}

const Mention = observer((props: MentionProps) => {
  const { userName, personaId, getMention, isMine } = props;

  const { roomStore, personaStore } = useCoreStore();
  const { uiStore, configStore } = useStore();

  let navigate: NavigateFunction | null = null;

  if (isMobile()) {
    navigate = useNavigate();
  }

  const handleClickMention = async (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    if (!personaStore.getPersona(personaId))
      await personaStore.fetchPersona({ personaId: personaId });
    const persona = personaStore.getPersona(personaId);
    if (!persona) return;
    if (isMobile() && navigate) {
      uiStore.setSelectedPersonaId(personaId);
      navigate(`/talk/${roomStore.currentRoomId}#profile`);
    } else {
      uiStore.setSelectedPersona(persona);
      uiStore.setSelectedPersonaId(personaId);
      uiStore.setDesktopProfileAnchorEl(target);
      uiStore.setDesktopProfilePosition(isMine ? 'myMention' : 'otherMention');
    }
  };

  if (getMention) {
    return (
      <>
        <S.MentionText
          onClick={handleClickMention}
          color={
            isMine
              ? configStore.MyMessageStyle.MentionColor
              : configStore.OtherMessageStyle.MentionColor
          }
        >
          @{userName}
        </S.MentionText>
      </>
    );
  }
  return <>@{userName}</>;
});

export default Mention;
