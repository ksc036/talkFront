import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '../Styled';

const Reserve = observer(() => {
  const { roomStore } = useCoreStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClickReserve = () => {
    navigate(`/talk/${roomStore.currentRoomId}/reserve`);
  };

  return (
    <S.ItemWrapper onClick={handleClickReserve}>
      <Squircle
        size={52}
        color="rgba(14, 196, 120, 0.2)"
        icon={
          <Icon.TimeFill width={28} height={28} color="rgba(14, 196, 120, 1)" />
        }
      />
      <S.Title theme={theme}>예약 메시지</S.Title>
    </S.ItemWrapper>
  );
});

export default Reserve;
