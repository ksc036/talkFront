import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

export const Drive = () => {
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.DriveLine width={20} height={20} />}
      text={configStore.AppNames.Drive}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
