import { MouseEvent, useEffect, useState } from 'react';

import { PersonaModel, useCoreStore } from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from './styled';

interface ContactChipProps {
  inviteeInfo: PersonaModel;
  onItemCheck?: (inviteeInfo: PersonaModel) => void;
  onItemUncheck?: () => void;
  checked: boolean;
  color?: string;
}

const ContactChip = observer((props: ContactChipProps) => {
  const { inviteeInfo, onItemCheck, onItemUncheck, checked } = props;

  const { personaStore } = useCoreStore();

  const [profileImgUrl, setProfileImgUrl] = useState<string | undefined>();

  const { nick } = inviteeInfo;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (typeof onItemCheck === 'function') {
      onItemCheck(inviteeInfo);
    }
  };

  const handleUnCheck = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (typeof onItemUncheck === 'function') {
      onItemUncheck();
    }
  };

  useEffect(() => {
    (async () => {
      if (inviteeInfo.id) {
        const personaInfo = await personaStore.getPersona(inviteeInfo.id);
        if (personaInfo)
          setProfileImgUrl(personaInfo?.profileImage?.small ?? '');
      }
    })();
  }, [inviteeInfo]);

  return (
    <S.ChipItem onClick={handleClick}>
      <S.ChipItemContent>
        {checked && (
          <S.DeleteIconButton onClick={handleUnCheck}>
            <Icon.DeleteFill width={16} height={16} />
          </S.DeleteIconButton>
        )}
        <Avatar size={40} imgSrc={profileImgUrl ?? ''} />
        <S.ChipItemInfo
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <S.PersonaName>{nick}</S.PersonaName>
        </S.ChipItemInfo>
      </S.ChipItemContent>
    </S.ChipItem>
  );
});

export default ContactChip;
