import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ReactComponent as NoticeIcon } from '@/assets/icons/NoticeIcon.svg';
import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';

const Notice = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { roomStore } = useCoreStore();

  const handleNoticeClick = () => {
    navigate(`/talk/${roomStore.currentRoomId}/notice#create`);
  };

  return (
    <S.ItemWrapper onClick={handleNoticeClick}>
      <Squircle
        size={52}
        color="rgba(114, 135, 177, 0.2)"
        icon={
          <S.NoticeIconWrapper>
            <NoticeIcon width={24} height={24} />
          </S.NoticeIconWrapper>
        }
      />
      <S.Title theme={theme}>공지</S.Title>
    </S.ItemWrapper>
  );
});

export default Notice;
