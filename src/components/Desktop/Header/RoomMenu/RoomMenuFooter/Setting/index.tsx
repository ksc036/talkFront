import { useState } from 'react';

import { DesktopRoomSettingDialog, RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme, Tooltip } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';
import { useStore } from '@/stores';
// import { getAuthority } from '@/utils';

interface SettingProps {
  onRoomDeleteButtonClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

export const Setting = observer(({ onRoomDeleteButtonClick }: SettingProps) => {
  const { roomStore } = useCoreStore();
  const theme = useTheme();
  const { configStore, talkStore } = useStore();
  const { appId } = talkStore;

  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  // const authority = getAuthority(null, currentRoom, userStore.selectedPersona);

  const [open, setOpen] = useState(false);

  return (
    <>
      <S.RoomMenuIcon onClick={() => setOpen(true)}>
        <Tooltip
          title={`${configStore.FeatureNameType.Room} 정보 및 설정`}
          sx={{
            '.MuiTooltip-tooltip': {
              color: theme.Color.Background[0],
              backgroundColor: theme.Color.Gray[900],
            },
          }}
        >
          <Icon.SettingLine width={20} height={20} />
        </Tooltip>
      </S.RoomMenuIcon>

      <DesktopRoomSettingDialog
        open={open}
        onClose={() => setOpen(false)}
        appId={appId}
        roomId={roomStore.currentRoomId}
        onRemoveRoom={() => {
          if (configStore.homeType.homeShape === 'my') {
            roomStore.setCurrentRoomId(roomStore.myRoom?.id as number);
          } else {
            roomStore.setCurrentRoomId(0);
          }
        }}
      />
    </>
  );
});
