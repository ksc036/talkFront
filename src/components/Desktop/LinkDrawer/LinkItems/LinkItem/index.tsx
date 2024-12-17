import { useState } from 'react';

import { useShell } from '@shell/sdk';
import { Icon, Checkbox, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { LinkModel } from '@/models';
import { useStore } from '@/stores';
import { safeHttpsUrl, isAppUrl, getAppUrl, isMobile } from '@/utils';

import * as S from './styled';

const LinkItem = observer(({ link }: { link: LinkModel }) => {
  const shell = useShell();
  const { configStore, linkStore } = useStore();
  const { Color } = useTheme();

  const [showLinkImage, setShowLinkImage] = useState<boolean>(true);

  const handleClickLink = () => {
    const href = safeHttpsUrl(link.ogUrl);
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

  const handleCheckboxClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    linkStore.setCheckedLinks(link.linkId as number, link.personaId);
  };

  const handleMoreButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    linkStore.setSelectedLink(link as LinkModel);
    linkStore.setAnchorMenu(e.currentTarget);
  };

  const handleLinkImageError = () => {
    setShowLinkImage(false);
  };

  return (
    <S.LinkItemWrapper onClick={handleClickLink}>
      {link.ogImageUrl && showLinkImage ? (
        <S.LinkImage src={link.ogImageUrl} onError={handleLinkImageError} />
      ) : (
        <S.LinkNoImage>
          <Icon.CorruptedFill width={24} height={24} color={Color.Gray[400]} />
          링크 이미지가 없습니다.
        </S.LinkNoImage>
      )}

      <S.LinkCheckBoxWrapper checkedColor={configStore.MainColor}>
        <Checkbox
          checkboxSize={20}
          checked={linkStore.checkedLinks
            .map((checkedLink) => checkedLink.linkId)
            .includes(link.linkId as number)}
          onClick={handleCheckboxClick}
        />
      </S.LinkCheckBoxWrapper>

      <S.LinkMoreButtonWrapper
        onClick={(event) => handleMoreButtonClick(event)}
        focused={linkStore.selectedLink?.linkId === link.linkId}
      >
        <Icon.MoreLine width={20} height={20} />
      </S.LinkMoreButtonWrapper>

      <S.LinkInfo>
        <S.LinkTitle>{link.ogTitle ?? '미리보기가 없습니다.'}</S.LinkTitle>
        <S.LinkDescription>
          {link.ogDescription ?? '여기를 눌러 링크를 확인하세요.'}
        </S.LinkDescription>
        <S.LinkUrl color={configStore.MyMessageStyle.OgLinkColor}>
          {link.ogUrl}
        </S.LinkUrl>
      </S.LinkInfo>
    </S.LinkItemWrapper>
  );
});

export default LinkItem;
