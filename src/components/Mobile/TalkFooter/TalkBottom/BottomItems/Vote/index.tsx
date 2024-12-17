import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ReactComponent as VoteIcon } from '@/assets/icons/VoteIcon.svg';
import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';

const Vote = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { roomStore } = useCoreStore();

  const handleVoteClick = () => {
    navigate(`/talk/${roomStore.currentRoomId}/allvote#createvote`);
  };

  return (
    <S.ItemWrapper onClick={handleVoteClick}>
      <Squircle
        size={52}
        color="rgba(255, 117, 208, 0.2)"
        icon={<VoteIcon width={24} height={24} />}
      />
      <S.Title theme={theme}>투표</S.Title>
    </S.ItemWrapper>
  );
});

export default Vote;
