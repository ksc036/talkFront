import React from 'react';

import { useStore } from '@/stores';

import * as S from './styled';

const NewMessage = () => {
  const { configStore } = useStore();
  return (
    <S.SystemNewWrapper>
      <S.SystemNewText
        backgroundColor={configStore.AutoMessageBackgroundColor}
        color={configStore.AutoMessageTextColor}
      >
        {'여기까지 읽었습니다.'}
      </S.SystemNewText>
    </S.SystemNewWrapper>
  );
};

export default NewMessage;
