import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';

export const Setting = observer(() => {
  const navigate = useNavigate();
  const { roomStore } = useCoreStore();

  return (
    <>
      <S.RoomMenuIcon
        onClick={() => {
          navigate(`/talk/${roomStore.currentRoomId}/drawer/settings`);
        }}
      >
        <Icon.SettingLine width={20} height={20} />
      </S.RoomMenuIcon>
    </>
  );
});
