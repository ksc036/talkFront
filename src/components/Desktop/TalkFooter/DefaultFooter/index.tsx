import { useEffect, useState } from 'react';

import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { Icon, Theme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react';

import * as S from '@/components/Desktop/Content/styled';
import AttachMore from '@/components/Desktop/TalkFooter/AttachmentItem/AttachMore';
import TalkFooter from '@/components/Desktop/TalkFooter/DefaultFooter/FooterTemplate';
import SendButton from '@/components/Desktop/TalkFooter/DefaultFooter/SendButton';
import Attach from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItems/Attach';
import Emoticon from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItems/Emoticon';
import Mail from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItems/Mail';
import Notice from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItems/Notice';
import Vote from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItems/Vote';
import TalkQuill from '@/components/Desktop/TalkFooter/DefaultFooter/TalkQuill';
import { useStore } from '@/stores';
import { AttachmentStore } from '@/stores/AttachmentStore';
import { ConfigStore } from '@/stores/configStore';
import { EditorStore } from '@/stores/EditorStore';
import { UIStore } from '@/stores/UIStore';
import { getRoomRestraints } from '@/utils';

import TalkFooterItem from './TalkFooterItem';
import Editor from './TalkFooterItems/Editor';
import ViewMore from './TalkFooterItems/ViewMore';

export interface DefaultFooterPorps {
  attachmentStore: AttachmentStore;
  editorStore: EditorStore;
  configStore: ConfigStore;
  uiStore: UIStore;
  isMyRoom: boolean;
  isBotRoom?: boolean;
  currentRoomId: number;
  theme: Theme;
  quillRef: React.MutableRefObject<any>;
  handleEnter: () => void;
  modules: any;
}

const DefaultFooter = observer((props: DefaultFooterPorps) => {
  const {
    uiStore,
    attachmentStore,
    editorStore,
    isMyRoom,
    currentRoomId,
    theme,
    quillRef,
    handleEnter,
    modules,
  } = props;

  const { userStore, roomStore } = useCoreStore();
  const { configStore, talkStore } = useStore();

  const { isDisabled, isRestricted } = useObserver(() => {
    return getRoomRestraints(
      userStore.selectedPersona as PersonaModel,
      roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    );
  });

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [showItems, setShowItems] = useState<boolean>(false);
  const HIDE_ITEMS_WIDTH = 670;

  const handleShowItems = () => {
    setShowItems(true);
  };

  const renderTalkFooterMenu = () => {
    if (attachmentStore.attachments.length) {
      return [<AttachMore key="attachmore" />];
    }

    const talkFooterMenuItems = [
      (talkStore.isMini ? !uiStore.openToolbar : true) &&
        configStore.FooterMenuItems.Mail &&
        !!roomStore.getRoomById(roomStore.currentRoomId as number)?.mail && (
          <Mail key="mail" />
        ),
      (talkStore.isMini ? !uiStore.openToolbar : true) &&
        configStore.FooterMenuItems.File && <Attach key="attach" />,
      (talkStore.isMini ? !uiStore.openToolbar : true) &&
        configStore.FooterMenuItems.Emoticon && <Emoticon key="emoticon" />,
      (talkStore.isMini ? !uiStore.openToolbar : true) && !isMyRoom && (
        <ViewMore key="reserve" />
      ),
      (talkStore.isMini ? !uiStore.openToolbar : true) &&
        isMyRoom &&
        configStore.FooterMenuItems.Notice && <Notice key="notice" />,
      configStore.FooterMenuItems.Editor && <Editor key="editor" />,
    ].filter(Boolean);

    if (talkFooterMenuItems.length > 0) {
      if (talkStore.isMini || width > HIDE_ITEMS_WIDTH || showItems) {
        return talkFooterMenuItems;
      } else {
        return [
          <TalkFooterItem
            key="showIcon"
            onClick={handleShowItems}
            icon={<Icon.ArrowFrontLine width={24} height={24} />}
          />,
        ];
      }
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (window) {
        if (uiStore.openLinkDrawer) {
          setWidth(window.innerWidth - 800);
        } else {
          setWidth(window.innerWidth);
        }

        if (window.innerWidth > HIDE_ITEMS_WIDTH) {
          setShowItems(false);
        }
      }
    };
    updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [uiStore.openLinkDrawer]);

  useEffect(() => {
    setShowItems(false);
  }, [roomStore.currentRoomId]);

  return (
    <TalkFooter
      uiStore={uiStore}
      configStore={configStore}
      attachmentStore={attachmentStore}
      editorStore={editorStore}
      TalkFooterMenu={!isDisabled ? renderTalkFooterMenu() : undefined}
      MessageInput={
        <>
          {uiStore.openReplyInfo && (
            <S.IconWrap>
              <Icon.ReplyLine
                width={24}
                height={24}
                color={configStore.InputMessageStyle.ReplyArrowColor}
              />
            </S.IconWrap>
          )}
          <TalkQuill
            theme={theme}
            editorStore={editorStore}
            roomId={currentRoomId}
            ref={quillRef}
            handleEnter={handleEnter}
            modules={modules}
            placeholder={
              !isDisabled
                ? '메시지를 입력하세요.'
                : isRestricted
                ? '채팅 제한의 유저는 메시지를 보낼 수 없습니다.'
                : '메시지를 보낼 수 없습니다.'
            }
            readOnly={isDisabled}
          />
        </>
      }
      SendButton={<SendButton />}
    />
  );
});

export default DefaultFooter;
