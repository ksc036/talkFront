import React from 'react';

import * as S from './Styled';

interface InputStatusInfoProps {
  nameList: Array<string>;
}

const InputStatusInfo = (props: InputStatusInfoProps) => {
  const { nameList } = props;

  return <S.Wrapper>{nameList.join(', ')}님이 입력중 입니다...</S.Wrapper>;
};

export default InputStatusInfo;
