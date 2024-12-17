import { useEffect } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import { TalkComponentProps } from '@/@types';
import LinkDrawer from '@/components/Desktop/LinkDrawer';
import Talk from '@/components/Desktop/Talk';
import { rootStore, useStore } from '@/stores';
import { printTalkInfo } from '@/utils/printTalkInfo';

import * as S from './style';

const TalkComponent = observer((props: TalkComponentProps) => {
  const { uiStore, configStore } = useStore();
  const coreStore = useCoreStore();
  const docsStore = useDocsStore();
  const {
    appId,
    width,
    height,
    style,
    messageMenu,
    footerMenu,
    headerMenu,
    supportedFileType,
    useRoomEnterTime,
    showFullScreenViewer,
  } = props;
  const otherMessageStyle = style?.OtherMessageStyle;
  const myMessageStyle = style?.MyMessageStyle;
  const highlightedMessageStyle = style?.HighlightedMessageStyle;
  const bodyColor = style?.BodyColor;
  const headerColor = style?.HeaderColor;
  const searchBarStyle = style?.SearchBarStyle;
  const messageMenuStyle = style?.MessageMenuStyle;
  const autoMessageStyle = style?.AutoMessageStyle;
  const inputMessageStyle = style?.InputMessageStyle;
  const floatingButtonBackgroundColor = style?.FloatingButtonBackgroundColor;
  const floatingButtonColor = style?.FloatingButtonColor;
  const buttonPrimaryColor = style?.ButtonPrimaryColor;
  const mainColor = style?.MainColor;
  if (otherMessageStyle) configStore.setOtherMessageStyle(otherMessageStyle);
  if (myMessageStyle) configStore.setMyMessageStyle(myMessageStyle);
  if (highlightedMessageStyle)
    configStore.setHighlightedMessageStyle(highlightedMessageStyle);
  if (bodyColor) configStore.setBodyColor(bodyColor);
  if (headerColor) configStore.setHeaderColor(headerColor);
  if (searchBarStyle) configStore.setSearchBarStyle(searchBarStyle);
  if (messageMenuStyle) configStore.setMessageMenuStyle(messageMenuStyle);
  if (autoMessageStyle) configStore.setAutoMessageStyle(autoMessageStyle);
  if (inputMessageStyle) configStore.setInputMessageStyle(inputMessageStyle);
  if (floatingButtonBackgroundColor)
    configStore.setFloatingButtonBackgroundColor(floatingButtonBackgroundColor);
  if (floatingButtonColor)
    configStore.setFloatingButtonColor(floatingButtonColor);
  if (buttonPrimaryColor) configStore.setButtonPrimaryColor(buttonPrimaryColor);
  if (mainColor) configStore.setMainColor(mainColor);
  if (messageMenu) configStore.setMessageMenu(messageMenu);
  if (footerMenu) configStore.setFooterMenuItems({ ...footerMenu });
  if (headerMenu) configStore.setHeaderMenuItems({ ...headerMenu });
  if (headerMenu?.RoomMenu === false) {
    configStore.setProfileDialogVisible(false);
    configStore.setMentionType('None');
  }
  if (supportedFileType) configStore.setSupportedExtensions(supportedFileType);
  if (typeof useRoomEnterTime === 'boolean')
    configStore.setRoomEnter(useRoomEnterTime);
  if (typeof showFullScreenViewer === 'boolean') {
    uiStore.setShowFullScreenViewer(showFullScreenViewer);
  }
  if (width && width < 380) {
    uiStore.setShowMessageMenus(false);
  }

  useEffect(() => {
    docsStore.initialize(Number(window.APP_ID) ? Number(window.APP_ID) : 1);
    rootStore.addCoreStore(coreStore);
    printTalkInfo();
  }, []);

  return (
    <S.TalkContainer width={width} height={height} id="TalkContainer">
      <Talk {...props} appId={appId} />
      {uiStore.openLinkDrawer && <LinkDrawer />}
    </S.TalkContainer>
  );
});

export default TalkComponent;
