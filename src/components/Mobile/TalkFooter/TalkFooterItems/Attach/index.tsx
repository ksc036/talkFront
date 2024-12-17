import { useState, MouseEvent } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';

import AttachmentModal from '../../Modal/AttachmentModal';
import { useStore } from '@/stores';
import { useCoreStore } from '@wapl/core';

const Attach = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { getAttachmentStore } = useStore();
  const { roomStore } = useCoreStore();
  const attachmentStore = getAttachmentStore(roomStore.currentRoomId as number);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!attachmentStore.readyToUpload) return;
    setAnchorEl(event.currentTarget);
  };
  const { Color } = useTheme();

  return (
    <>
      <TalkFooterItem
        icon={
          <Icon.AttachLine width={24} height={24} color={Color.Gray[900]} />
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
