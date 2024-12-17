import { useCoreStore } from '@wapl/core';
import { Icon, Tooltip, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';

export const Alarm = observer(() => {
  const { roomStore } = useCoreStore();
  const theme = useTheme();
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
        <Tooltip
          title="알림 끄기"
          sx={{
            '.MuiTooltip-tooltip': {
              color: theme.Color.Background[0],
              backgroundColor: theme.Color.Gray[900],
            },
          }}
        >
          <Icon.AlarmOnFill width={20} height={20} />
        </Tooltip>
      ) : (
        <Tooltip
          title="알림 켜기"
          sx={{
            '.MuiTooltip-tooltip': {
              color: theme.Color.Background[0],
              backgroundColor: theme.Color.Gray[900],
            },
          }}
        >
          <Icon.AlarmOnLine width={20} height={20} />
        </Tooltip>
      )}
    </S.RoomMenuIcon>
  );
});
