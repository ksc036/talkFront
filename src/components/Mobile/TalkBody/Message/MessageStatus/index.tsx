import { useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import useSendAttach from '@/hooks/useSendAttach';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';

import * as S from './styled';

interface StatusButtonProps {
  message: MessageModel;
}

const StatusButton = observer((props: StatusButtonProps) => {
  const { message } = props;
  const [isCloseHover, setIsCloseHover] = useState(false);
  const [isRetryHover, setIsRetryHover] = useState(false);
  const { messageStore, fileStore, getEditorStore } = useStore();
  const statusDict = messageStore.uploadMessageInfo[message.tempId as string];
  const { personaStore, roomStore, userStore } = useCoreStore();
  const docsStore = useDocsStore();
  const editorStore = getEditorStore(roomStore.currentRoomId as number);
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;
  const myId = userStore.selectedPersona?.id || 1234; // 임시
  const nick = personaStore.getPersona(myId)?.nick || 'nick'; // 임시
  const room = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const parentId = !editorStore.content
    ? messageStore.replyMessage?.msgId
    : undefined;
  const { uploadRetry } = useSendAttach({
    myId,
    nick,
    roomName: room.name,
    parentId,
    docsUploadFunction,
  });
  const handleStopClick = () => {
    if (message.msgType.includes('file')) {
      try {
        const source = fileStore.uploadTempInfo[message.tempId as string];
        source.source.cancel();
      } catch (e) {}
    }
    statusDict.source.cancel();
    statusDict.status = 'fail';
  };

  const handleCancelClick = () => {
    const index = messageStore.messages.findIndex(
      (ele) => ele.tempId === message.tempId,
    );
    if (index !== -1) messageStore.messages.splice(index, 1);
    try {
      delete messageStore.uploadMessageInfo[message.tempId as string];
    } catch (e) {}
  };

  const handleRetryClick = async () => {
    if (statusDict.retryAttach && message.tempId)
      await uploadRetry(
        statusDict.retryAttach,
        message.tempId,
        statusDict.msg.msgType,
      );
    else messageStore.createMessage(statusDict.msg, true);
  };

  return (
    <S.Wraaper>
      {statusDict?.status === 'fail' ? (
        <S.FailDiv>
          <S.ButtonWraaper
            onMouseEnter={() => setIsRetryHover(true)}
            onMouseLeave={() => setIsRetryHover(false)}
            isHover={isRetryHover}
            onClick={handleRetryClick}
          >
            <Icon.RenewLine />
          </S.ButtonWraaper>

          <S.ButtonWraaper
            onMouseEnter={() => setIsCloseHover(true)}
            onMouseLeave={() => setIsCloseHover(false)}
            isHover={isCloseHover}
            onClick={handleCancelClick}
          >
            <Icon.CloseLine />
          </S.ButtonWraaper>
        </S.FailDiv>
      ) : (
        <S.LoadingDiv
          onMouseEnter={() => setIsCloseHover(true)}
          onMouseLeave={() => setIsCloseHover(false)}
        >
          {isCloseHover ? (
            <S.ButtonWraaper isHover={isCloseHover} onClick={handleStopClick}>
              <Icon.CloseLine />
            </S.ButtonWraaper>
          ) : (
            <Icon.LoadingMotion />
          )}
        </S.LoadingDiv>
      )}
    </S.Wraaper>
  );
});

export default StatusButton;
