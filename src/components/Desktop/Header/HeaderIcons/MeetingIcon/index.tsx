import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { AppIds } from '@types';

import HeaderIcon from '..';

const MeetingIcon = observer(() => {
  const shell = useShell();

  const { configStore } = useStore();
  const { roomStore } = useCoreStore();

  const handleClickMeeting = () => {
    try {
      shell.runApp({
        appId: `${AppIds.MEETING}`,
        args: {
          roomId: roomStore.currentRoomId,
          metaMessage: true,
          meetingId: -1,
        },
        options: { isWindow: true },
      });
    } catch {
      console.log('error: handleClickMeeting');
    }
  };

  return (
    <HeaderIcon
      name={configStore.AppNames.Meeting}
      icon={<Icon.MeetingLine width={20} height={20} />}
      onClick={handleClickMeeting}
    />
  );
});

export default MeetingIcon;
