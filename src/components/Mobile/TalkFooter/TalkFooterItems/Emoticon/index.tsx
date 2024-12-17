import { MouseEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import TalkFooterItem from '@mobile/TalkFooter/TalkFooterItem';

const Emoticon = observer(() => {
  const { Color } = useTheme();
  const { uiStore, getAttachmentStore } = useStore();
  const { roomStore } = useCoreStore();
  const attachmentStore = getAttachmentStore(roomStore.currentRoomId as number);

  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    if (!attachmentStore.readyToUpload) return;
    uiStore.setEmoticonModalVisible(true);
    if (!location.pathname.includes('bottomItems'))
      navigate(`/talk/${roomStore.currentRoomId}/bottomItems`);
  };
  useEffect(() => {
    // if (!uiStore.openEmoticonModal) setAnchorEl(null);
  }, [uiStore.openEmoticonModal]);

  return (
    <>
      <TalkFooterItem
        icon={
          uiStore.openEmoticonModal ? (
            <Icon.Emoji1Line width={24} height={24} color={Color.Gray[900]} />
          ) : (
            <Icon.Emoji1Line width={24} height={24} color={Color.Gray[400]} />
          )
        }
        onClick={handleClick}
      />
    </>
  );
});

export default Emoticon;
