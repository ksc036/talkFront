import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import useSubApp from '@/hooks/useSubApp';
import { useStore } from '@/stores';

import HeaderIcon from '..';

const CalendarIcon = observer(() => {
  const { openCalendarApp } = useSubApp();
  const { configStore } = useStore();

  return (
    <HeaderIcon
      name={configStore.AppNames.Calendar}
      icon={<Icon.CalendarLine width={20} height={20} />}
      onClick={openCalendarApp}
    />
  );
});

export default CalendarIcon;
