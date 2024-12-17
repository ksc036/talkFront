import React from 'react';

import InputStatusInfo from './InputStatusInfo';
import InputUserProfile from './InputUserProfile';
import * as S from './Styled';

const InputStatusBar = () => {
  const inputUserList = [
    {
      name: '정인화',
      url: 'https://img.insight.co.kr/static/2021/03/10/700/img_20210310154430_hy083zx4.webp',
    },
    {
      name: '이호용',
      url: 'http://image.dongascience.com/Photo/2022/06/6982fdc1054c503af88bdefeeb7c8fa8.jpg',
    },
  ];
  const nameList = inputUserList.map((list) => list.name);
  const urlList = inputUserList.map((list) => list.url);

  return (
    <S.Wrapper>
      <InputUserProfile urlList={urlList} />
      <InputStatusInfo nameList={nameList} />
    </S.Wrapper>
  );
};

export default InputStatusBar;
