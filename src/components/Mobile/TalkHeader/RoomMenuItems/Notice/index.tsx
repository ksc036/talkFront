import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface NoticeProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Notice = (props: NoticeProps) => {
  const { closeMenu } = props;

  const { uiStore } = useStore();

  const handleOnClick = () => {
    transaction(() => {
      uiStore.setNoticeDialogMode('list');
      uiStore.openDialog('notice');
      closeMenu();
    });
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.NoticeLine width={20} height={20} />}
      text="공지"
    />
  );
};
