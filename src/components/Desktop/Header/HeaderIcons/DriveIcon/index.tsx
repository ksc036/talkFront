import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import useSubApp from '@/hooks/useSubApp';
import { useStore } from '@/stores';

import HeaderIcon from '..';

const DriveIcon = observer(() => {
  const { openDriveApp } = useSubApp();
  const { configStore } = useStore();

  const openDrive = () => {
    openDriveApp({ docsAppType: 0 });
  };

  return (
    <HeaderIcon
      name={configStore.AppNames.Drive}
      icon={<Icon.FolderLine width={20} height={20} />}
      onClick={openDrive}
    />
  );
});

export default DriveIcon;
