import React from 'react';

import { useShell } from '@shell/sdk';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import { LinkModel, MessageModel } from '@/models';
import { useStore } from '@/stores';
import { getAppUrl, isAppUrl, isMobile, safeHttpsUrl } from '@/utils';

import * as S from './styled';

interface URLMessageProps {
  style?: React.CSSProperties;
  msgBody: MessageModel['msgBody'] | LinkModel;
  isForBody?: boolean;
  isMine?: boolean;
}

const URLMessage = observer((props: URLMessageProps) => {
  const { msgBody, style, isForBody = false, isMine = true } = props;

  const shell = useShell();
  const { configStore, linkStore } = useStore();

  const handleClickUrlMessage = () => {
    const href = safeHttpsUrl(msgBody.ogUrl);
    if (isAppUrl(href)) {
      const urlAppInfo = getAppUrl(href);
      const { appId, ...filteredUrlAppInfo } = urlAppInfo;
      shell.runApp({
        appId: `${appId}`,
        args: filteredUrlAppInfo,
      });
    } else if (isMobile()) {
      shell.mobile.deepLink.openNativeApp(href);
    } else {
      shell.openWindow(href);
    }
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    linkStore.setSelectedLink(msgBody as LinkModel);
    linkStore.setAnchorMenu(e.currentTarget);
  };

  return (
    <S.UrlWrapper
      onClick={handleClickUrlMessage}
      ogImageUrl={msgBody.ogImageUrl}
      style={{ ...style }}
    >
      {!isForBody && (
        <S.LinkMenuButton onClick={handleOpenMenu}>
          <Icon.MoreLine width={24} height={24} />
        </S.LinkMenuButton>
      )}
      {msgBody.ogImageUrl ? (
        <S.UrlImage src={msgBody.ogImageUrl}></S.UrlImage>
      ) : (
        <>{!isForBody && <S.NoUrlImage />}</>
      )}
      {((isForBody && msgBody.ogImageUrl) || !isForBody) && (
        <S.UrlInfoWrapper isAlone={!!!msgBody.ogImageUrl}>
          <S.UrlTitle>{msgBody.ogTitle ?? '미리보기가 없습니다.'}</S.UrlTitle>
          <S.UrlDesc>
            {msgBody.ogDescription ?? '여기를 눌러 링크를 확인하세요.'}
          </S.UrlDesc>
          <S.UrlText
            color={
              isMine
                ? configStore.MyMessageStyle.OgLinkColor
                : configStore.OtherMessageStyle.OgLinkColor
            }
          >
            {msgBody.ogUrl}
          </S.UrlText>
        </S.UrlInfoWrapper>
      )}
    </S.UrlWrapper>
  );
});

export default URLMessage;
