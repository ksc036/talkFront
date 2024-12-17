import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from './styled';

const SearchButton = observer(() => {
  const navigate = useNavigate();
  const { roomStore } = useCoreStore();

  return (
    <S.IconButton
      onClick={() => navigate(`/talk/${roomStore.currentRoomId}/search`)}
    >
      <Icon.SearchLine width={24} height={24} />
    </S.IconButton>
  );
});

export default SearchButton;
