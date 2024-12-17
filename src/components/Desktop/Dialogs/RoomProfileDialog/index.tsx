import React, { Dispatch, SetStateAction } from 'react';

import { DesktopRoomProfileDialog, RoomModel, useCoreStore } from '@wapl/core';

import { useStore } from '@/stores';

interface RoomProfileDialogProps {
  roomId: RoomModel['id'] | null;
  setRoomId: Dispatch<SetStateAction<number | null>>;
}

const RoomProfileDialog = (props: RoomProfileDialogProps) => {
  const { roomId, setRoomId } = props;
  const { roomStore } = useCoreStore();
  const { uiStore, talkStore } = useStore();
  const { appId } = talkStore;

  const handleClickEnterRoom = (room: RoomModel) => {
    if (room.id) {
      uiStore.setSelectedLNBTab('room');
      roomStore.setCurrentRoomId(room.id);
      setRoomId(null);
    }
  };

  const handleCloseRoomProfile = () => {
    setRoomId(null);
  };

  return (
    <DesktopRoomProfileDialog
      appId={appId}
      isOpen={!!roomId}
      roomId={roomId}
      onEnter={handleClickEnterRoom}
      onClose={handleCloseRoomProfile}
    />
  );
};

export default RoomProfileDialog;
