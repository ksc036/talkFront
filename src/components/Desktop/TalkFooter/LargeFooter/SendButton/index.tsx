import { useCallback, useContext } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme, Tooltip } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react';

import useMessageFormatter from '@/hooks/useMessageFormatter';
import useSendAttach from '@/hooks/useSendAttach';
import useSendMessage from '@/hooks/useSendMessage';
import { useStore } from '@/stores';
import { TopPropsContext } from '@/TopPropsProvider';
import { getRoomType } from '@/utils';

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
  const { personaStore, userStore, roomStore } = useCoreStore();
  const docsStore = useDocsStore();
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore(currentRoomId);
  const attachmentStore = getAttachmentStore(currentRoomId);
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const { docsUploadCallback } = useContext(TopPropsContext);
  const disabled = useObserver(() => {
    if (userStore.selectedPersona?.restriction)
      return userStore.selectedPersona?.restriction?.restrictedType & 4;
    return false;
  });

  const handleSendBtn = useCallback(async () => {
    if (disabled) return;
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
    const { toDelete } = await sendAttach();
    const result = await send(toDelete);
    if (result) {
      messageStore.scrollToBottom('auto');
    }
  }, [editorStore]);

  const hasSticker = uiStore.openStickerPreview;
  const hasAttach = attachmentStore.attachments.length;
  const hasContent = useObserver(() => !editorStore.isEmpty);
  const turnOn = (hasSticker || hasAttach || hasContent) && !disabled;

  return (
    <Tooltip
      title="전송"
      sx={{
        '.MuiTooltip-tooltip': {
          color: Color.Background[0],
          backgroundColor: Color.Gray[900],
        },
      }}
    >
      <S.Wrapper onClick={handleSendBtn}>
        <Icon.SendFill
          width={24}
          height={24}
          color={turnOn ? configStore.config.MainColor : Color.Gray[400]}
        />
      </S.Wrapper>
    </Tooltip>
  );
});

export default SendButton;
