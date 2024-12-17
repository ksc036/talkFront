import { MouseEvent } from 'react';

import { RoomModel } from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';

import * as S from './styled';

interface RoomChipProps {
  inviteeInfo: Partial<RoomModel>;
  onItemCheck?: (inviteeInfo: Partial<RoomModel>) => void;
  onItemUncheck?: () => void;
  checked: boolean;
  color?: string;
}

const RoomChip = (props: RoomChipProps) => {
  const { inviteeInfo, onItemCheck, onItemUncheck, checked } = props;

  const { name, personaCount } = inviteeInfo;

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

  return (
    <S.ChipItem onClick={handleClick}>
      <S.ChipItemContent>
        {checked && (
          <S.DeleteIconButton onClick={handleUnCheck}>
            <Icon.DeleteFill width={16} height={16} />
          </S.DeleteIconButton>
        )}
        <Avatar
          size={40}
          imgSrc={inviteeInfo?.profileImageSource ?? ''}
          isEditMode={checked}
          onDelete={() => alert('닫기 버튼 클릭')}
        />
        <S.ChipItemInfo>
          <S.PersonaName>{name || name}</S.PersonaName>
          <S.PersonaSub style={{ marginLeft: '4px' }}>
            {personaCount}
          </S.PersonaSub>
        </S.ChipItemInfo>
      </S.ChipItemContent>
    </S.ChipItem>
  );
};

export default RoomChip;
