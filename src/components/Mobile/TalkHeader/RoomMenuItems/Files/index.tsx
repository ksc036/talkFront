import { Icon, Mui } from '@wapl/ui';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface FilesProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Files = (props: FilesProps) => {
  const { closeMenu } = props;
  const { configStore } = useStore();

  const handleOnClick = () => {
    closeMenu();
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.AttachLine width={20} height={20} />}
      text={
        configStore.headerMenuAppsTitle === '앱 연동'
          ? configStore.AppNames.File
          : '파일'
      }
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      rightButtonStyle={{ marginLeft: 'auto' }}
    />
  );
};
