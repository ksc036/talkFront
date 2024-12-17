import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';

export const Pin = observer(() => {
  const { roomStore } = useCoreStore();
  const currentRoomInfo = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  );

  const handleBookmarkChange = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    roomStore.toggleBookmark({ roomId: roomStore.currentRoomId as number });
  };

  return (
    <S.RoomMenuIcon onClick={handleBookmarkChange}>
      {currentRoomInfo?.myInfo?.isRoomBookmark ? (
        <Icon.PinFill width={20} height={20} />
      ) : (
        <Icon.PinLine width={20} height={20} />
      )}
    </S.RoomMenuIcon>
  );
});
