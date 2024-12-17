import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

export const Calendar = () => {
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.CalendarLine width={20} height={20} />}
      text={configStore.AppNames.Calendar}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
