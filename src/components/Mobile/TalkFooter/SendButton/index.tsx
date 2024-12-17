import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react';

import TalkFooterItem from '@/components/Mobile/TalkFooter/TalkFooterItem';
import useMessageFormatter from '@/hooks/useMessageFormatter';
import useSendAttach from '@/hooks/useSendAttach';
import useSendMessage from '@/hooks/useSendMessage';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

const SendButton = observer(() => {
  const { Color } = useTheme();
  const {
    getEditorStore,
    messageStore,
    uiStore,
    getAttachmentStore,
    configStore,
  } = useStore();
  const { personaStore, roomStore, userStore } = useCoreStore();
  const docsStore = useDocsStore();
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore(currentRoomId);
  const attachmentStore = getAttachmentStore(currentRoomId);
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const location = useLocation();
  const navigate = useNavigate();
  const disabled = useObserver(() => {
    if (userStore.selectedPersona?.restriction)
      return userStore.selectedPersona?.restriction?.restrictedType & 4;
    return false;
  });

  const handleSendBtn = useCallback(async () => {
    if (disabled) return;
    if (!attachmentStore.readyToUpload) return;
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const { isDm } = getRoomType(room);
    const msg = useMessageFormatter(
      editorStore,
      currentRoomId,
      nick,
      isDm ? nick : room.name,
    );
    const parentId = !editorStore.content
      ? messageStore.replyMessage?.msgId
      : undefined;
    const { send, clear } = useSendMessage(msg, editorStore);
    const { clearAttach, sendAttach } = useSendAttach({
      myId,
      nick,
      roomName: isDm ? nick : room.name,
      msg,
      parentId,
      docsUploadFunction,
    });
    if (location.pathname.includes('bottomItems')) {
      navigate(-1);
    }
    clear();
    clearAttach();
    const { toDelete, attachResult } = await sendAttach();
    const result = await send(toDelete);
    if (result || attachResult) {
      messageStore.scrollToBottom('auto');
    }
  }, [editorStore, location.pathname]);

  const hasSticker = uiStore.openStickerPreview;
  const hasAttach = attachmentStore.attachments.length;
  const hasContent = useObserver(() => !editorStore.isEmpty);
  const turnOn =
    (hasSticker || hasAttach || hasContent) &&
    !disabled &&
    attachmentStore.readyToUpload;

  return (
    <TalkFooterItem
      onClick={handleSendBtn}
      icon={
        <Icon.SendFill
          width={24}
          height={24}
          color={turnOn ? configStore.MainColor : Color.Gray[400]}
        />
      }
    />
  );
});

export default SendButton;
