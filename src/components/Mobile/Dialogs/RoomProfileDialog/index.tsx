import { useLocation, useNavigate } from 'react-router-dom';

import { MobileRoomProfileDialog } from '@wapl/core';

import { useStore } from '@/stores';

interface RoomProfileDialogProps {
  roomId: number;
  open: boolean;
  onClose: () => void;
}

const RoomProfileDialog = (props: RoomProfileDialogProps) => {
  const { open, roomId, onClose } = props;
  const { talkStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { appId } = talkStore;

  const handleClose = () => {
    onClose();
  };

  const handleEnterRoom = async () => {
    if (location.pathname === '/talk') {
      navigate(`/talk/${roomId}`);
    } else {
      navigate(`/talk/${roomId}`, { replace: true });
    }
    onClose();
  };

  return (
    <MobileRoomProfileDialog
      roomId={roomId}
      appId={appId}
      isOpen={open}
      onClose={handleClose}
      onEnter={handleEnterRoom}
    />
  );
};

export default RoomProfileDialog;
