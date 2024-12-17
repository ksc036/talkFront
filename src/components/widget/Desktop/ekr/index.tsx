import { useEffect, useRef, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { stringToMoment } from '@/utils';

import FavoriteRoomItem from './FavoriteRoomItem';
import * as S from './styled';

const FavoriteRoom = observer(() => {
  const { roomStore } = useCoreStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSingleColumn, setIsSingleColumn] = useState(false);
  const [dimOpacity, setDimOpacity] = useState(0);
  const wrapperRef = useRef<HTMLUListElement | null>(null);

  const roomList = roomStore.roomList
    .filter(
      (room) => room.isVisible && room.myInfo && room.myInfo.isRoomBookmark,
    )
    .sort((roomA, roomB) => {
      if (!roomA.myInfo?.roomBmRegiDate || !roomB.myInfo?.roomBmRegiDate)
        return 0;
      const roomABmDate = stringToMoment(roomA.myInfo?.roomBmRegiDate);
      const roomBBmDate = stringToMoment(roomB.myInfo?.roomBmRegiDate);
      if (roomABmDate.isAfter(roomBBmDate)) return -1;
      if (roomABmDate.isBefore(roomBBmDate)) return 1;
      return 0;
    });

  useEffect(() => {
    (async () => {
      await roomStore.fetchRoomList({
        appId: 'tmax.core-ai.talk',
      });
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const element = wrapperRef.current;
      if (!element) return;
      const width = element.offsetWidth;
      setIsSingleColumn(width <= 166);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    handleResize();

    const handleScroll = () => {
      const element = wrapperRef.current;
      if (!element) return;
      const scrollBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      // 스크롤 위치에 따라 dimOpacity 값을 조정
      // 스크롤이 60px 이하로 남으면 dimOpacity를 0으로 설정
      const newOpacity = Math.min(scrollBottom / 60, 1);
      setDimOpacity(newOpacity);
    };
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('scroll', handleScroll);
    }
    handleScroll();

    return () => {
      if (wrapperRef.current) {
        resizeObserver.unobserve(wrapperRef.current);
        wrapperRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [roomList.length]);

  return (
    <S.Wrapper>
      {roomList.length > 0 ? (
        <>
          <S.RoomListWrapper ref={wrapperRef} isSingleColumn={isSingleColumn}>
            {roomList.map((room, index) => (
              <FavoriteRoomItem room={room} key={room.name + index} />
            ))}
          </S.RoomListWrapper>
          <S.DimOverlay dimOpacity={dimOpacity} />
        </>
      ) : (
        <S.NoRoomWrapper>
          {isLoaded && (
            <S.NoRoomText>{'즐겨찾기 한 구성원이 없습니다.'}</S.NoRoomText>
          )}
        </S.NoRoomWrapper>
      )}
    </S.Wrapper>
  );
});

export default FavoriteRoom;
