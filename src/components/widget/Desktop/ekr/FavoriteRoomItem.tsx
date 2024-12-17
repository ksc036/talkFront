import { useShell } from '@shell/sdk';
import { RoomModel } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from './styled';

interface FavoriteRoomItemProps {
  room: RoomModel;
  onClickRoom?: (room: RoomModel) => void;
}

const FavoriteRoomItem = observer((props: FavoriteRoomItemProps) => {
  const { room } = props;

  const shell = useShell();

  const handleClickRoom = (roomId: number) => {
    shell.runApp({
      appId: 'tmax.core-ai.talk',
      args: {
        roomId: roomId,
      },
    });
  };

  const displayAvatarImages = room.profileImageSource ?? '';

  return (
    <S.RoomItemWrapper onClick={() => handleClickRoom(room.id)}>
      <Avatar size={40} imgSrc={displayAvatarImages} />
      <S.RoomName>{room.name}</S.RoomName>
    </S.RoomItemWrapper>
  );
});

export default FavoriteRoomItem;
