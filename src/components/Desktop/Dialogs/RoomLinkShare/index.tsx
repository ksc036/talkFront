import react, { useCallback, useEffect, useState } from 'react';

import {
  DesktopMemberSelectorDialog,
  DesktopRoomLinkSharePopover,
  RoomModel,
  useCoreStore,
} from '@wapl/core';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import { getDmRoomTypeId, recoverHiddenRoom } from '@/utils';

const RoomLinkShare = observer(() => {
  const { uiStore, talkStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const { appId } = talkStore;

  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);

  const handleCloseShareLinkPopover = useCallback(() => {
    uiStore.closeDialog('shareLink');
    uiStore.setRoomLinkShareAnchorEl(null);
  }, []);

  const handleCloseShareLinkDialog = () => {
    setShareLinkDialogOpen(false);
  };

  const handleShareLink = async (selectedData?: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    const personaList = selectedData?.selectedPersonaList;
    const roomIdList = selectedData?.selectedRoomList;

    const receiverCount =
      (personaList?.length ?? 0) + (roomIdList?.length ?? 0);

    if (personaList && roomIdList) {
      const room = roomStore.getRoomById(
        roomStore.currentRoomId as number,
      ) as RoomModel;
      const roomLink = await roomStore.fetchRoomLink({
        appId: appId,
        roomId: room?.id,
      });

      const roomList: number[] = [...roomIdList];
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

      const shareLinkDto = {
        appId: appId,
        roomIdList: roomIdList,
        contactIdList: personaList,
        roomLink: roomLink,
        url: `${location.origin}?appId=${appId}&roomLink=${roomLink}`,
      };

      await recoverHiddenRoom(room.id);
      try {
        await roomStore.shareRoomLink(shareLinkDto);
        handleCloseShareLinkDialog();
        uiStore.openToast(
          `${receiverCount}개의 ${configStore.FeatureNameType.Room}에 ${configStore.FeatureNameType.Room} 링크를 전송했습니다.`,
        );
      } catch {
        console.log('room link share failed');
      }
    }
  };

  return (
    <>
      <DesktopRoomLinkSharePopover
        room={roomStore.getRoomById(roomStore.currentRoomId) as RoomModel}
        appId={appId}
        onClose={handleCloseShareLinkPopover}
        onClickMoreButton={() => {
          setShareLinkDialogOpen(true);
        }}
        anchorEl={uiStore.roomLinkShareAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 360 }}
        sx={{
          '.MuiPaper-root': {
            borderRadius: '12px',
          },
        }}
      />
      <DesktopMemberSelectorDialog
        appId={appId}
        title={`${configStore.FeatureNameType.Room} 링크 공유`}
        isOpen={shareLinkDialogOpen}
        submitButtonOption={{
          text: '공유',
          onClick: handleShareLink,
          showCount: true,
        }}
        cancelButtonOption={{
          text: '취소',
          onClick: handleCloseShareLinkDialog,
        }}
        onClose={handleCloseShareLinkDialog}
        disabledIds={{ room: [roomStore.currentRoomId as number], persona: [] }}
        detailSearchItemKeys={configStore.MemberSelectorSearchKeys}
      />
    </>
  );
});

export default RoomLinkShare;
