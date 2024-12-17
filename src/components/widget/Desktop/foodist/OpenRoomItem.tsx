import React from 'react';

import { RoomModel } from '@wapl/core';

import * as S from './styled';

interface OpenRoomItemProps {
  room: RoomModel;
  onClickRoom?: (room: RoomModel) => void;
}

const OpenRoomItem = (props: OpenRoomItemProps) => {
  const { room, onClickRoom } = props;

  const handleClickRoom = () => {
    if (typeof onClickRoom === 'function') onClickRoom(room);
  };

  return (
    <S.RoomItemWrapper onClick={handleClickRoom}>
      <S.Profile>
        <S.RoomImg src={room.profileImageSource as string} />
      </S.Profile>
      <S.RoomInfoWrapper>
        <S.RoomInfo>
          <S.RoomName>{room.name}</S.RoomName>
          <S.RoomCount>{room.personaCount}</S.RoomCount>
        </S.RoomInfo>
        {room.hashtagNameList.length > 0 && (
          <S.RoomTagWrapper>
            {room.hashtagNameList.map((hashTag) => (
              <S.RoomTag key={hashTag}>{`#${hashTag} `}</S.RoomTag>
            ))}
          </S.RoomTagWrapper>
        )}
      </S.RoomInfoWrapper>
    </S.RoomItemWrapper>
  );
};

export default OpenRoomItem;
