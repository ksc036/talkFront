import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

import useSubApp from '@/hooks/useSubApp';

interface LinksProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Links = (props: LinksProps) => {
  const { closeMenu } = props;
  const { uiStore } = useStore();
  const { closeSubApp } = useSubApp();

  const handleOnClick = () => {
    transaction(async () => {
      await closeSubApp();
      uiStore.setOpenLinkDrawer(true);
      closeMenu();
    });
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.LinkLine width={20} height={20} />}
      text="링크"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
