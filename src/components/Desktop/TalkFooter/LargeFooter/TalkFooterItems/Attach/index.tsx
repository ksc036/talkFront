import { useState, MouseEvent } from 'react';

import { Icon } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItem';
import AttachmentModal from '@/components/Desktop/TalkFooter/Modal/AttachmentModal';
import { useStore } from '@/stores';

const Attach = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { configStore } = useStore();

  return (
    <>
      <TalkFooterItem
        title="파일 첨부"
        icon={
          <Icon.AttachLine
            width={24}
            height={24}
            color={configStore.IconColor}
          />
        }
        onClick={handleClick}
      />
      <AttachmentModal
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      ></AttachmentModal>
    </>
  );
};

export default Attach;
