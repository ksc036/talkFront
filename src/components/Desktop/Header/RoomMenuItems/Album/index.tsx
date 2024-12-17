import { Icon } from '@wapl/ui';

import { RoomMenuItem } from '../../RoomMenu';

export const Album = () => {
  return (
    <RoomMenuItem
      icon={<Icon.ImageLine width={20} height={20} />}
      text="사진, 동영상"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
