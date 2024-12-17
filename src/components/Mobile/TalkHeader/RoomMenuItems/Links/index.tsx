import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { RoomMenuItem } from '../../RoomMenuItem';

interface LinksProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Links = (props: LinksProps) => {
  const { closeMenu } = props;

  const handleOnClick = () => {
    transaction(() => {
      // ...
      closeMenu();
    });
  };
  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.LinkLine width={20} height={20} />}
      text="링크"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      rightButtonStyle={{ marginLeft: 'auto' }}
    />
  );
};
