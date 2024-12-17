import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';

export const Alarm = observer(() => {
  const { roomStore } = useCoreStore();
  const currentRoomInfo = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  );

  const handleAlarmChange = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    currentRoomInfo?.toggleAlarm();
  };

  return (
    <S.RoomMenuIcon onClick={handleAlarmChange}>
      {currentRoomInfo?.myInfo?.useRoomAlarm ? (
        <Icon.AlarmOnFill width={20} height={20} />
      ) : (
        <Icon.AlarmOnLine width={20} height={20} />
      )}
    </S.RoomMenuIcon>
  );
});
