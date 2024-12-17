import { useLocation, useNavigate } from 'react-router-dom';

import { useCoreStore, MobileRoomSettingDialog, RoomModel } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

export const RoomSettingDialog = observer(() => {
  const location = useLocation();
  const { roomStore } = useCoreStore();
  const { talkStore } = useStore();
  const navigate = useNavigate();
  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const { appId } = talkStore;

  return (
    <>
      {location.pathname.includes('settings') && (
        <MobileRoomSettingDialog
          isOpen={location.pathname.includes('settings')}
          onClose={() => {
            navigate(-1);
          }}
          appId={appId}
          room={currentRoom}
        />
      )}
    </>
  );
});
