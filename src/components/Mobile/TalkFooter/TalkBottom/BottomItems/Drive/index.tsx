import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';
import { useStore } from '@/stores';
import { AppIds, AppType, RunToppingMessageType } from '@types';

const Drive = observer(() => {
  const theme = useTheme();
  const shell = useShell();
  const { configStore } = useStore();
  const { roomStore } = useCoreStore();

  const handleDriveClick = async () => {
    const res = await shell.runApp({
      appId: String(AppIds.DOCS),
      args: {
        runToppingType: RunToppingMessageType.NAVIGATE_TARGET_ROOM,
        docsAppType: AppType.DOCSDRIVE,
        roomId: roomStore.currentRoomId,
      },
    });

    if (res) {
      shell.mobile.mobileUi.showGnb();
    }
  };

  return (
    <S.ItemWrapper onClick={handleDriveClick}>
      <Squircle
        size={52}
        color="rgba(62, 162, 255, 0.2)"
        icon={<Icon.DriveFill width={24} height={24} color="#319CFF" />}
      />
      <S.Title theme={theme}>{configStore.AppNames.Drive}</S.Title>
    </S.ItemWrapper>
  );
});

export default Drive;
