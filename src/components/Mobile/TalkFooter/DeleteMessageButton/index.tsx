import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Button } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import * as S from './styled';

const DeleteMessageButton = observer(() => {
  const { messageStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const navigate = useNavigate();

  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();

  const [open, setOpen] = useState<boolean>(false);

  const onClickDelete = async () => {
    const myId = userStore.selectedPersona?.id.toString() ?? '';
    const isMyRoom = getRoomType(
      roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    ).isMyRoom;

    const res = await messageStore.deleteMessage({
      messageIds: messageStore.deleteMessageIdList,
      isMyRoom,
      personaId: myId,
    });

    try {
      await Promise.all(
        messageStore.deleteMessageDocumentIdsList.map((messageDocumentIds) =>
          messageDocumentIds.documentIds.map((messageDocumentId) => {
            driveStore.forceDeleteDocument(Number(messageDocumentId));
          }),
        ),
      );
      messageStore.clearDeleteMessageDocumentIdsList();
    } catch (error) {
      throw error;
    }

    if (res) {
      messageStore.clearDeleteMessageIdList();
      navigate(-1);
    } else {
      setOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    messageStore.clearDeleteMessageIdList();
    messageStore.clearDeleteMessageDocumentIdsList();
    navigate(-1);
  };

  return (
    <>
      <S.ButtonWrapper>
        <Button
          size="extra-large"
          width="100%"
          onClick={onClickDelete}
          disabled={!messageStore.deleteMessageIdList.length}
        >
          {'삭제하기'}
        </Button>
      </S.ButtonWrapper>
      <ConfirmDialog
        open={open}
        title={'메시지를 삭제할 수 있는 시간이 지났습니다.'}
        onClickOk={handleCloseDialog}
      />
    </>
  );
});

export default DeleteMessageButton;
