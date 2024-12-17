import {
  // DesktopRoom, MobileRoom,
  RoomModel,
} from '@wapl/core';

import { isMobile } from '@/utils';

interface RoomProfileDialogProps {
  open: boolean;
  onEnter: () => void;
  onClose: () => void;
  roomInfo: RoomModel | undefined;
}

const RoomProfileDialog = (props: RoomProfileDialogProps) => {
  // const { open, onEnter, onClose, roomInfo } = props;

  if (isMobile()) {
    return (
      <>
        {/* {roomInfo && open && (
          // SAS 작업 필요
          <MobileRoom.RoomProfileDialog
            open={open}
            onEnter={onEnter}
            onClose={onClose}
            roomInfo={roomInfo}
            variant="join"
            imgSrc=""
          />
        )} */}
      </>
    );
  }
  return (
    <>
      {/* {roomInfo && open && (
        // SAS 작업 필요
        <DesktopRoom.RoomProfileDialog
          open={open}
          onEnter={onEnter}
          onClose={onClose}
          roomInfo={roomInfo}
          variant="join"
          imgSrc=""
        />
      )} */}
    </>
  );
};

export default RoomProfileDialog;
