import React from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';

import * as S from './styled';

interface OpenRoomItemProps {
  room: RoomModel;
  onClickRoom?: (room: RoomModel) => void;
}

const OpenRoomItem = (props: OpenRoomItemProps) => {
  const { room, onClickRoom } = props;

  const { personaStore } = useCoreStore();
  const theme = useTheme();

  const handleClickRoom = () => {
    if (typeof onClickRoom === 'function') onClickRoom(room);
  };

  return (
    <S.RoomItemWrapper onClick={handleClickRoom}>
      <S.RoomImg src={room.profileImageSource as string} />
      <S.RoomInfoWrapper>
        <S.RoomInfoRow>
          <S.RoomName>{room.name}</S.RoomName>
        </S.RoomInfoRow>
        <S.RoomInfoRow>
          <S.AdminName>
            {personaStore.getPersona(room.regiPersonaId)?.nick}
          </S.AdminName>
          <Icon.UserLine width={12} height={12} color={theme.Color.Gray[600]} />
          <S.RoomUserCount>{room.personaCount}</S.RoomUserCount>
        </S.RoomInfoRow>
      </S.RoomInfoWrapper>
    </S.RoomItemWrapper>
  );
};

export default OpenRoomItem;
