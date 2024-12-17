import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { useTheme, Icon, Squircle } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './style';

export const MemberInvite = observer(() => {
  const { configStore } = useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();

  const navigate = useNavigate();

  const handleInviteDialogOpen = () => {
    navigate(`/talk/${roomStore.currentRoomId}/invite`, {
      replace: true,
    });
  };

  return (
    <S.MemberItemWrapper onClick={handleInviteDialogOpen}>
      <Squircle
        size={36}
        color={Color.Gray[100]}
        icon={
          <Icon.Add2Line width={18} height={18} color={configStore.MainColor} />
        }
      />
      <S.RoomMenuText color={configStore.MainColor}>
        대화 상대 초대
      </S.RoomMenuText>
    </S.MemberItemWrapper>
  );
});
