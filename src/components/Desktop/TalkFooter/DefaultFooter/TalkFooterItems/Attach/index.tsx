import { useState, MouseEvent } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';

import AttachmentModal from '../../../Modal/AttachmentModal';
import { useCoreStore } from '@wapl/core';
import { useStore } from '@/stores';

const Attach = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { getAttachmentStore, configStore } = useStore();
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
        title="파일 첨부"
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
