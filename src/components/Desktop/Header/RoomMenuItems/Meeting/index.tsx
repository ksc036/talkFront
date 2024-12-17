import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

export const MeetingMenuItem = () => {
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.MeetingLine width={20} height={20} />}
      text={configStore.AppNames.Meeting}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
