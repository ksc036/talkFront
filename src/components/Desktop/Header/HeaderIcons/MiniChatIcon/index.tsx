import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import HeaderIcon from '..';

const MiniChatIcon = observer(() => {
  const { roomStore } = useCoreStore();
  const { talkStore, configStore } = useStore();
  const { appId } = talkStore;
  const shell = useShell();

  const handleClickMiniChat = () => {
    shell.runApp({
      appId: String(appId),
      args: {
        isMini: true,
        roomId: roomStore.currentRoomId,
      },
      options: {
        isWindow: true,
        width: 460,
        height: 680,
      },
    });
  };

  return (
    <HeaderIcon
      name={configStore.FeatureNameType.MiniChat}
      icon={
        window.env.BUSINESS_NAME === 'SEN' ? (
          <Icon.ChatMiniLine width={20} height={20} />
        ) : (
          <Icon.NewWindowLine width={20} height={20} />
        )
      }
      onClick={handleClickMiniChat}
    />
  );
});

export default MiniChatIcon;
