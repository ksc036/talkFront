import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';
import { useStore } from '@/stores';
import { AppIds, RunToppingMessageType, AppType } from '@types';

const Drawer = observer(() => {
  const theme = useTheme();
  const shell = useShell();

  const { configStore } = useStore();
  const { roomStore } = useCoreStore();

  const handleDrawerClick = async () => {
    await shell.runApp({
      appId: String(AppIds.DOCS),
      args: {
        runToppingType: RunToppingMessageType.NAVIGATE_TARGET_ROOM,
        docsAppType: AppType.TALKDRIVE,
        roomId: roomStore.currentRoomId,
      },
    });
  };

  return (
    <S.ItemWrapper onClick={handleDrawerClick}>
      <Squircle
        size={52}
        color="rgba(254, 199, 56, 0.2)"
        icon={<Icon.FolderColor width={24} height={24} />}
      />
      <S.Title theme={theme}>{configStore.AppNames.File}</S.Title>
    </S.ItemWrapper>
  );
});

export default Drawer;
