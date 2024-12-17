import { useState } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';

import TalkFooterItem from '../../TalkFooterItem';
import ViewMorePopover from '../../ViewMorePopover';

const ViewMore = () => {
  const { Color } = useTheme();
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenu);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };
  return (
    <>
      <TalkFooterItem
        title="더보기"
        icon={<Icon.Add2Line width={24} height={24} color={Color.Gray[900]} />}
        onClick={handleClick}
      />
      {openMenu && (
        <ViewMorePopover open={anchorMenu} handleClose={handleCloseMenu} />
      )}
    </>
  );
};

export default ViewMore;
