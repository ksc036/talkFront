import React from 'react';

import * as S from './styled';

interface UserNameProps {
  userName: string;
}

const UserName = (props: UserNameProps) => {
  const { userName } = props;

  return <S.Wrapper>{userName}</S.Wrapper>;
};

export default UserName;
