import { useEffect, useState } from 'react';

import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { stringToMoment } from '@/utils';

import FavoriteRoomItem from './FavoriteRoomItem';
import TalkIcon from './newTalkIcon.png';
import * as S from './styled';

interface FavoriteRoomProps {
  width?: number | string;
  height?: number | string;
}

const FavoriteRoom = observer((props: FavoriteRoomProps) => {
  const { width, height } = props;

  const shell = useShell();
  const { roomStore } = useCoreStore();

  const [isLoading, setIsLoading] = useState(true);

  // 일반 대화방, 오픈 대화방 상단 고정 대화방
  // 최신 고정한 순으로 5개
  // 오픈룸 아이디: 2
  // 프라이빗룸 아이디: 3
  // dm 아이디: 4
  const roomList = roomStore.roomList
    .filter(
      (room) =>
        room.isVisible &&
        room.myInfo &&
        room.myInfo.isRoomBookmark &&
        (room.typeId === 2 || room.typeId === 3 || room.typeId === 4),
    )
    .sort((roomA, roomB) => {
      if (!roomA.myInfo?.roomBmRegiDate || !roomB.myInfo?.roomBmRegiDate)
        return 0;
      const roomABmDate = stringToMoment(roomA.myInfo?.roomBmRegiDate);
      const roomBBmDate = stringToMoment(roomB.myInfo?.roomBmRegiDate);
      if (roomABmDate.isAfter(roomBBmDate)) return -1;
      if (roomABmDate.isBefore(roomBBmDate)) return 1;
      return 0;
    })
    .slice(0, 5);

  const handleClickMoveMyRoom = () => {
    shell.runApp({
      appId: 'tmax.core-ai.talk',
      args: {
        openMyRoom: true,
      },
    });
  };

  const handleClickMakeRoom = () => {
    shell.runApp({
      appId: 'tmax.core-ai.talk',
      args: {
        openCreateRoomDialog: true,
      },
    });
  };

  useEffect(() => {
    (async () => {
      await roomStore.fetchRoomList({ appId: 'tmax.core-ai.talk' });
      setIsLoading(false);
    })();
  }, []);

  return (
    <S.Wrapper width={width} height={height}>
      <S.ContentDiv>
        <S.RoomDiv backGroundColor={'#E0F0FF'} onClick={handleClickMoveMyRoom}>
          <S.RoomInfo>
            <Avatar
              size={64}
              imgSrc={roomStore.myRoom?.profileImageSource ?? ''}
              bgColor="#3663f6cc"
            />
            <S.RoomInfoText>나와의 대화방</S.RoomInfoText>
          </S.RoomInfo>
        </S.RoomDiv>
        <S.RoomDiv backGroundColor={'#5782F61A'} onClick={handleClickMakeRoom}>
          <S.RoomInfo>
            <img src={TalkIcon} />
            <S.RoomInfoText>새 대화방 만들기</S.RoomInfoText>
          </S.RoomInfo>
        </S.RoomDiv>
      </S.ContentDiv>
      <S.FavoriteDiv>
        <S.FavoriteTitleDiv>
          <Icon.PinLine width={18} height={18} color={'#5782F6'} />
          <S.FavoriteTitle>{'상단 고정 대화방'}</S.FavoriteTitle>
        </S.FavoriteTitleDiv>
        <S.FavoriteRoomListDiv>
          {roomList.length > 0 ? (
            <S.RoomListWrapper>
              {roomList.map((room, index) => (
                <FavoriteRoomItem room={room} key={room.name + index} />
              ))}
            </S.RoomListWrapper>
          ) : (
            <S.NoRoomWrapper>
              {!isLoading && (
                <S.NoRoomText>{'상단 고정 대화방이 없습니다.'}</S.NoRoomText>
              )}
            </S.NoRoomWrapper>
          )}
        </S.FavoriteRoomListDiv>
      </S.FavoriteDiv>
    </S.Wrapper>
  );
});

export default FavoriteRoom;
