import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface DriveProps {
  onClick: () => Promise<void>;
}

export const Drive = (props: DriveProps) => {
  const { onClick } = props;
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.DriveLine width={20} height={20} />}
      text={configStore.AppNames.Drive}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      onClick={onClick}
    />
  );
};
