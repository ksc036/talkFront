import { RoomModel, useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import RoomExit from './RoomExit';
import * as S from './style';
interface RoomMenuFooterProps {
  roomFooterMenuItems?: React.ReactNode[];
}

export const RoomMenuFooter = observer((props: RoomMenuFooterProps) => {
  const { roomFooterMenuItems } = props;
  const { roomStore } = useCoreStore();
  const { configStore } = useStore();

  const currentRoomId = roomStore.currentRoomId as number;
  const currentRoom = roomStore.getRoomById(currentRoomId) as RoomModel;
  const roomType = getRoomType(currentRoom);

  return (
    <>
      <S.RoomMenuFooterWrapper>
        {configStore.RoomMenuItemsType.RoomMenuFooterExit &&
          !roomType.isMyRoom &&
          !roomType.isOrg && <RoomExit />}
        <S.RoomFooterMenuIconWrapper>
          {roomFooterMenuItems}
        </S.RoomFooterMenuIconWrapper>
      </S.RoomMenuFooterWrapper>
    </>
  );
});

export { Alarm } from './Alarm';
export { Pin } from './Pin';
export { Setting } from './Setting';
