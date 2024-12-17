import React, { HtmlHTMLAttributes } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import Attachments from '@/components/Desktop/TalkFooter/Attachments';
import * as S from '@/components/Desktop/TalkFooter/DefaultFooter/FooterTemplate/Styled';
import UploadLoading from '@/components/Desktop/TalkFooter/DefaultFooter/UploadLoading';
import { AttachmentStore } from '@/stores/AttachmentStore';
import { ConfigStore } from '@/stores/configStore';
import { EditorStore } from '@/stores/EditorStore';
import { UIStore } from '@/stores/UIStore';
import { getRoomType } from '@/utils';

import EditorToolbar from '../../EditorToolbar';
import ReplyInfo from '../../ReplyInfo';

interface TalkFooterProps extends HtmlHTMLAttributes<HTMLDivElement> {
  uiStore: UIStore;
  configStore: ConfigStore;
  attachmentStore: AttachmentStore;
  editorStore: EditorStore;
  TalkFooterMenu?: React.ReactNode[];
  MessageInput?: React.ReactNode;
  SendButton?: React.ReactNode;
}

const TalkFooter = observer((props: TalkFooterProps) => {
  const {
    uiStore,
    attachmentStore,
    configStore,
    editorStore,
    TalkFooterMenu,
    MessageInput,
    SendButton,
    style,
  } = props;
  const { roomStore } = useCoreStore();
  const { isBotRoom } = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
  );
  return (
    <S.messageWrap>
      {uiStore.openReplyInfo && <ReplyInfo />}
      {!isBotRoom && <Attachments />}
      <S.Wrapper style={{ ...style }}>
        {TalkFooterMenu && TalkFooterMenu.length > 0 && (
          <S.MenuWrapper>{TalkFooterMenu}</S.MenuWrapper>
        )}
        <S.InputWrapper
          backgroundColor={configStore.InputMessageStyle.BackGroundColor}
        >
          {uiStore.openToolbar && <EditorToolbar editorStore={editorStore} />}
          <S.MessageInputWrapper openToolbar={uiStore.openToolbar}>
            {MessageInput} {SendButton}
          </S.MessageInputWrapper>
        </S.InputWrapper>
        {!attachmentStore.readyToUpload && <UploadLoading />}
      </S.Wrapper>
    </S.messageWrap>
  );
});

export default TalkFooter;
