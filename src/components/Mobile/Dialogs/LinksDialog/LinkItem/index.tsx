import React from 'react';

import { observer } from 'mobx-react';

import { LinkModel } from '@/models';
import { safeHttpsUrl } from '@/utils';

import * as S from './Styled';

interface URLMessageProps {
  link: LinkModel;
}

const LinkItem = observer((props: URLMessageProps) => {
  const { link } = props;

  const handleClickUrlMessage = () => {
    window.open(safeHttpsUrl(link.ogUrl));
  };

  return (
    <S.UrlWrapper onClick={handleClickUrlMessage}>
      {link.ogImageUrl ? (
        <S.UrlImage src={link.ogImageUrl} />
      ) : (
        <S.NoUrlImage />
      )}
      <S.UrlInfoWrapper isAlone={!!!link.ogImageUrl}>
        <S.UrlTitle>{link.ogTitle ?? '미리보기가 없습니다.'}</S.UrlTitle>
        <S.UrlDesc>
          {link.ogDescription ?? '여기를 눌러 링크를 확인하세요.'}
        </S.UrlDesc>
        <S.UrlText>{link.ogUrl}</S.UrlText>
      </S.UrlInfoWrapper>
    </S.UrlWrapper>
  );
});

export default LinkItem;
