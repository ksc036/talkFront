import { useCoreStore } from '@wapl/core';
import { Icon, Tooltip, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from './../style';

export const Star = observer(() => {
  const { roomStore } = useCoreStore();
  const theme = useTheme();
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
        <Tooltip
          title="즐겨찾기 해제"
          sx={{
            '.MuiTooltip-tooltip': {
              color: theme.Color.Background[0],
              backgroundColor: theme.Color.Gray[900],
            },
          }}
        >
          <Icon.BookmarkFill width={20} height={20} />
        </Tooltip>
      ) : (
        <Tooltip
          title="즐겨찾기"
          sx={{
            '.MuiTooltip-tooltip': {
              color: theme.Color.Background[0],
              backgroundColor: theme.Color.Gray[900],
            },
          }}
        >
          <Icon.BookmarkLine width={20} height={20} />
        </Tooltip>
      )}
    </S.RoomMenuIcon>
  );
});
