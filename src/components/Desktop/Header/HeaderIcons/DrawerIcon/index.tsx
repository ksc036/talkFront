import { observer } from 'mobx-react-lite';

import { ReactComponent as AppStoreIcon } from '@/assets/icons/AppStoreIcon.svg';
import useSubApp from '@/hooks/useSubApp';
import { useStore } from '@/stores';

import HeaderIcon from '..';

const DrawerIcon = observer(() => {
  const { openDriveApp } = useSubApp();
  const { configStore } = useStore();

  return (
    <HeaderIcon
      name={configStore.AppNames.File}
      icon={<AppStoreIcon style={{ width: '20px', height: '20px' }} />}
      onClick={() => {
        openDriveApp({ docsAppType: 1 });
      }}
    />
  );
});

export default DrawerIcon;
