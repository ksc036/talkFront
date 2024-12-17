import { useEffect } from 'react';

import { rootStore, useStore } from '@/stores';

const useFocusInOut = () => {
  const { messageStore } = useStore();
  const handleFocus = () => {
    messageStore.setIsFocus(true);
    if (messageStore.state === 'init') return;
    const roomId = rootStore.coreStore?.roomStore.currentRoomId;
    if (!roomId || roomId === -1) return;
    const roomLastReadMsgId = messageStore.getRoomMeta(roomId)?.lastMessageId;
    const roomUnreadCount = messageStore.roomMetadataMap.get(roomId)?.count;
    if (
      messageStore.state === 'done' &&
      roomLastReadMsgId !== undefined &&
      !!roomUnreadCount
    ) {
      messageStore.updateLastReadMessageId({
        roomId: roomId,
        msgId: roomLastReadMsgId,
      });
    }
  };

  const handleBlur = () => {
    messageStore.setIsFocus(false);
  };

  useEffect(() => {
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      handleBlur();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  return { handleFocus, handleBlur };
};

export default useFocusInOut;
