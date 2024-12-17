import { Icon } from '@wapl/ui';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

export const Note = () => {
  return (
    <RoomMenuItem
      icon={<Icon.NoteLine width={20} height={20} />}
      text="노트"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
