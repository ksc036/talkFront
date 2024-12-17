import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import useSubApp from '@/hooks/useSubApp';
import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

interface FilesProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Files = (props: FilesProps) => {
  const { closeMenu } = props;
  const { uiStore, configStore } = useStore();
  const { openDriveApp } = useSubApp();

  const handleOnClick = async () => {
    uiStore.closeDrawers();
    await openDriveApp({ docsAppType: 1 });
    transaction(() => {
      closeMenu();
    });
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.FileLine width={20} height={20} />}
      text={configStore.AppNames.File}
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
