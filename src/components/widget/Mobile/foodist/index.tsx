import React, { useEffect, useState } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import OpenRoomItem from './OpenRoomItem';
import * as S from './styled';

interface FamousOpenRoomProps {
  onClickRoom?: (room: RoomModel) => void;
  onClickMore?: () => void;
  onClickMakeOpenTalk?: () => void;
}

const FamousOpenRoom = observer((props: FamousOpenRoomProps) => {
  const { onClickRoom, onClickMore, onClickMakeOpenTalk } = props;

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
    <S.Wrapper>
      <S.HeaderWrapper>
        <S.TitleWrapper>
          <S.SubTitle>{'우리 같이 정보 공유해요'}</S.SubTitle>
          <S.Title>{'인기 성공톡'}</S.Title>
        </S.TitleWrapper>
        <S.RightSide onClick={handleClickMore}>
          <S.MoreText>{'더 보기'}</S.MoreText>
          <Icon.ArrowFrontLine
            width={16}
            height={16}
            color={theme.Color.Gray[400]}
          />
        </S.RightSide>
      </S.HeaderWrapper>
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
            성공톡 만들기
          </S.NoRoomButton>
        </S.NoRoomWrapper>
      )}
    </S.Wrapper>
  );
});

export default FamousOpenRoom;
