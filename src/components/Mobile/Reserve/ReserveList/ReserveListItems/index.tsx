import React, { useEffect, useState } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react-lite';

import { ReserveModel } from '@/models/ReserveModel';
import { useStore } from '@/stores';

import * as S from './styled';

interface ReserveListItemsProps {
  reserve: ReserveModel;
  handleReserveRead: () => void;
}

const ReserveListItems = observer((props: ReserveListItemsProps) => {
  const { reserve, handleReserveRead } = props;
  const { configStore, talkStore, uiStore, reserveStore } = useStore();
  const { appId } = talkStore;
  const { roomStore } = useCoreStore();
  const [currentRoom, setCurrentRoom] = useState<RoomModel | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      const room =
        roomStore.getRoomById(reserve.roomId) ||
        (await roomStore.fetchRoomDetail({
          roomId: reserve.roomId,
          appId: appId,
        }));
      setCurrentRoom(room);
    };

    fetchRoomData();
  }, [reserve.roomId]);

  const reserveStatus = () => {
    if (reserve.status === 'WAITING') {
      return '발송 예정';
    } else if (reserve.status === 'COMPLETED') {
      return '발송 완료';
    }
    return '발송 실패';
  };

  const handleClickListItem = () => {
    handleReserveRead();
    reserveStore.setCurrentReserveId(reserve.reservationId);
  };

  return (
    <S.ReserveListItemsWrapper
      colorEffect={configStore.MainColor}
      onClick={handleClickListItem}
    >
      <S.ReserveContent>{reserve.msgBody.content}</S.ReserveContent>
      <S.ReserveDate>
        {DateTime.fromISO(reserve.reservedAt).toFormat('yy년 MM월 dd일 HH:mm')}{' '}
        {reserveStatus()}
      </S.ReserveDate>
      <S.ReserveRoomWrapper>
        <Avatar
          size={18}
          imgSrc={currentRoom?.profileImageSource ?? ''}
          outLineColor={configStore.HeaderColor}
        />
        <S.ReserveRoomName>{currentRoom?.name}</S.ReserveRoomName>
      </S.ReserveRoomWrapper>
    </S.ReserveListItemsWrapper>
  );
});

export default ReserveListItems;
