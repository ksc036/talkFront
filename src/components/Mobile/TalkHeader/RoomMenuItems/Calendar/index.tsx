import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface CalendarProps {
  onClick: () => Promise<void>;
}

export const Calendar = (props: CalendarProps) => {
  const { onClick } = props;
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.CalendarLine width={20} height={20} />}
      text={configStore.AppNames.Calendar}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      onClick={onClick}
    />
  );
};
