import React, { useEffect, useState } from 'react';

import {
  RoomModel,
  // useCoreStore
} from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';

import OpenRoomItem from './OpenRoomItem';
import * as S from './styled';

interface FamousOpenRoomProps {
  width?: number | string;
  height?: number | string;
  onClickRoom?: (room: RoomModel) => void;
  onClickMore?: () => void;
  onClickMakeOpenTalk?: () => void;
}

const FamousOpenRoom = (props: FamousOpenRoomProps) => {
  const { width, height, onClickRoom, onClickMore, onClickMakeOpenTalk } =
    props;

  const theme = useTheme();
  // const { roomStore } = useCoreStore();

  const [roomList, setRoomList] = useState<RoomModel[]>([]);

  const handleClickMore = () => {
    if (typeof onClickMore === 'function') onClickMore();
  };

  const handleClickMakeOpenTalk = () => {
    if (typeof onClickMakeOpenTalk === 'function') onClickMakeOpenTalk();
  };

  useEffect(() => {
    (async () => {
      // SAS 작업 필요
      // const res = await roomStore.getFilteredRoomList(
      //   { orderBy: '-personaCount' },
      //   { page: 0, size: 5 },
      // );
      // setRoomList(res?.contents ?? []);
    })();
  }, []);

  return (
    <S.Wrapper width={width} height={height}>
      <S.Header>
        <S.Title>{'인기 성공톡'}</S.Title>
        <S.MoreButtonWrapper onClick={handleClickMore}>
          <S.MoreText>{'더 보기'}</S.MoreText>
          <Icon.ArrowFrontLine
            width={16}
            height={16}
            color={theme.Color.Gray[400]}
          />
        </S.MoreButtonWrapper>
      </S.Header>
      {roomList.length > 0 ? (
        <S.RoomListWrapper>
          {roomList.map((room) => (
            <OpenRoomItem key={room.id} room={room} onClickRoom={onClickRoom} />
          ))}
        </S.RoomListWrapper>
      ) : (
        <S.NoRoomWrapper>
          <S.NoRoomText>{'성공톡이 없습니다.'}</S.NoRoomText>
          <S.NoRoomSubText>{'지금 성공톡을 만들어보세요!'}</S.NoRoomSubText>
          <S.NoRoomButton onClick={handleClickMakeOpenTalk}>
            {'성공톡 만들기'}
          </S.NoRoomButton>
        </S.NoRoomWrapper>
      )}
    </S.Wrapper>
  );
};

export default FamousOpenRoom;
