import { useCallback, useContext } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react';

import useMessageFormatter from '@/hooks/useMessageFormatter';
import useSendAttach from '@/hooks/useSendAttach';
import useSendMessage from '@/hooks/useSendMessage';
import { useStore } from '@/stores';
import { TopPropsContext } from '@/TopPropsProvider';
import { getRoomType } from '@/utils';
import { isFormattedMessage } from '@/utils/editor';

import * as S from './Styled';

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
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore(currentRoomId);
  const attachmentStore = getAttachmentStore(currentRoomId);
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const { docsUploadCallback } = useContext(TopPropsContext);
  const docsStore = useDocsStore();
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;

  const handleSendBtn = useCallback(async () => {
    if (!attachmentStore.readyToUpload) return;
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const { isDm } = getRoomType(room);
    const isFormatted = isFormattedMessage(editorStore?.quillRef);
    const msg = useMessageFormatter(
      editorStore,
      currentRoomId,
      nick,
      isDm ? nick : room.name,
      isFormatted,
    );
    const parentId = messageStore.replyMessage?.msgId;
    const { send, clear } = useSendMessage(msg, editorStore);
    const { clearAttach, sendAttach } = useSendAttach({
      myId,
      nick,
      roomName: isDm ? nick : room.name,
      msg,
      docsUploadCallback,
      docsUploadFunction,
      parentId,
    });
    clear();
    clearAttach();
    const { toDelete, attachResult } = await sendAttach();
    const result = await send(toDelete);
    if (result || attachResult) {
      messageStore.scrollToBottom('auto');
    }
  }, [editorStore, attachmentStore.readyToUpload]);

  const hasSticker = uiStore.openStickerPreview;
  const hasAttach = attachmentStore.attachments.length;
  const hasContent = useObserver(() => !editorStore.isEmpty);
  const turnOn =
    (hasSticker || hasAttach || hasContent) && attachmentStore.readyToUpload;
  return (
    <S.Wrapper onClick={handleSendBtn}>
      <Icon.SendFill
        width={21}
        height={21}
        color={turnOn ? configStore.MainColor : Color.Gray[400]}
      />
    </S.Wrapper>
  );
});

export default SendButton;
