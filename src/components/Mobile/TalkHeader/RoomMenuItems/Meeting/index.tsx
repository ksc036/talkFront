import { Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface MeetingProps {
  onClick?: () => void | Promise<void>;
}
export const Meeting = ({ onClick }: MeetingProps) => {
  const { configStore } = useStore();

  return (
    <RoomMenuItem
      icon={<Icon.MeetingLine width={20} height={20} />}
      text={configStore.AppNames.Meeting}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      onClick={onClick}
    />
  );
};
