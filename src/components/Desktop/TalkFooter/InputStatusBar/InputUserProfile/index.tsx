import React from 'react';

import { Avatar } from '@wapl/ui';

import * as S from './Styled';

interface InputUserProfileProps {
  urlList: Array<string>;
}

const InputUserProfile = (props: InputUserProfileProps) => {
  const { urlList } = props;

  return (
    <S.Wrapper>
      <Avatar imgSrc={urlList ?? ''}></Avatar>
    </S.Wrapper>
  );
};

export default InputUserProfile;
