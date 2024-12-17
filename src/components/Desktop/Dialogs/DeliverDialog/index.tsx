import { useCallback } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import {
  DesktopMemberSelectorDialog,
  RoomModel,
  useCoreStore,
} from '@wapl/core';
import { observer } from 'mobx-react';

import { FileBody } from '@/@types';
import { useStore } from '@/stores';
import {
  contentToParseToList,
  getDmRoomTypeId,
  isJsonString,
  parseEmoticon,
  recoverHiddenRoom,
} from '@/utils';

const DeliverDialog = observer(() => {
  const { messageStore, uiStore, configStore, talkStore } = useStore();
  const { roomStore, userStore, personaStore } = useCoreStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const { appId } = talkStore;

  const title = '다른 ' + configStore.FeatureNameType.Room + '으로 전달';

  const handleCloseDeliverDialog = useCallback(() => {
    uiStore.closeDialog('deliver');
  }, []);

  const handleDeliver = async (selectedData?: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    const personaList = selectedData?.selectedPersonaList;
    const roomIdList = selectedData?.selectedRoomList;

    if (personaList && roomIdList) {
      const message = messageStore.hoveredMessage;
      const myId = userStore.selectedPersona?.id || 1;
      const myNick = personaStore.getPersona(myId)?.nick || 'nick';
      const room = roomStore.getRoomById(
        roomStore.currentRoomId as number,
      ) as RoomModel;

      if (message) {
        // 룸 생성
        const roomList: number[] = [...roomIdList];

        // 1:1 룸 생성
        const promiseTalk = personaList.map(async (personaId: number) => {
          if ((personaId as number) === userStore.selectedPersona?.id)
            return Promise.resolve({
              result: 'created',
              room: roomStore.myRoom,
            });
          else
            return roomStore.createRoom({
              appId: window.APP_ID,
              roomTypeId: getDmRoomTypeId(),
              selectedPersonaIdList: [personaId],
            });
        });

        const tempRoomList = await Promise.all(promiseTalk);
        tempRoomList.map((res) => {
          if (res.result === 'created' && res.room?.id)
            roomList.push(res.room.id);
        });
        for (const roomId of roomList) {
          // 파일 존재 시 파일 복사
          const copiedFiles: FileBody[] = [];
          if (
            (message.msgType.includes('file') ||
              message.msgType.includes('image') ||
              message.msgType.includes('video')) &&
            message.msgBody?.files?.length
          ) {
            const documentIds = message.msgBody.files
              ?.map((file) => file.id)
              .map(Number);
            const responses = await driveStore.requestCopy(roomId, documentIds);

            if (responses.length > 0) {
              responses.forEach((response) => {
                if (typeof response.documentId === 'number') {
                  const deliverFileBody = new FileBody({
                    id: response.documentId,
                    name: response.documentName.normalize('NFC'),
                    extension: response.documentExtension,
                    size: response.documentSize,
                    isDeleted: 0,
                  });

                  copiedFiles.push(deliverFileBody);
                }
              });
            }
          }

          // 전달
          const messageBody = {};
          if (message.msgBody.content) {
            const parsedList = contentToParseToList(message.msgBody.content);
            let content = '';
            parsedList.map((parsedText) => {
              const json = isJsonString(parsedText);
              if (json?.type === 'mention') content += `@${json?.mentionName}`;
              else if (json?.type === 'emoticon')
                content += parseEmoticon(json?.emoticonName);
              else content += parsedText;
            });
            Object.assign(messageBody, { content });
          }
          if (message.msgBody.ogUrl)
            Object.assign(messageBody, { ogUrl: message.msgBody.ogUrl });
          if (message.msgBody.mention)
            Object.assign(messageBody, { mention: message.msgBody.mention });
          if (message.msgBody.sticker)
            Object.assign(messageBody, { sticker: message.msgBody.sticker });
          if (message.msgBody.files && copiedFiles.length > 0)
            Object.assign(messageBody, { files: copiedFiles });

          const msgDto = {
            appId: appId,
            msgType: message.msgTypeNumber(),
            msgBody: messageBody,
            rawContent: message.rawContent,
            targetRoomId: roomId,
            nick: myNick,
            roomName: room.name,
          };
          await recoverHiddenRoom(roomId);
          const res = await messageStore.deliverMessage(roomId, msgDto);

          if (res) {
            handleCloseDeliverDialog();
          }
        }
      }
    }
  };

  return (
    <DesktopMemberSelectorDialog
      appId={appId}
      title={title}
      isOpen={uiStore.openDeliver}
      submitButtonOption={{
        text: '전달',
        onClick: handleDeliver,
        showCount: true,
      }}
      cancelButtonOption={{
        text: '취소',
        onClick: handleCloseDeliverDialog,
      }}
      onClose={handleCloseDeliverDialog}
      disabledIds={{ room: [roomStore.currentRoomId as number], persona: [] }}
      detailSearchItemKeys={configStore.MemberSelectorSearchKeys}
    />
  );
});

export default DeliverDialog;
