import React, { HtmlHTMLAttributes } from 'react';
import { useLocation } from 'react-router-dom';

import { observer } from 'mobx-react';

import MentionModal from '@/components/Common/MentionModal';
import UploadLoading from '@/components/Desktop/TalkFooter/DefaultFooter/UploadLoading';
import Attachments from '@/components/Mobile/TalkFooter/Attachments';
import * as S from '@/components/Mobile/TalkFooter/styled';
import TalkBottom from '@/components/Mobile/TalkFooter/TalkBottom';
import { useStore } from '@/stores';
import { AttachmentStore } from '@/stores/AttachmentStore';
import { UIStore } from '@/stores/UIStore';

import ReplyInfo from './ReplyInfo';

interface TalkFooterProps extends HtmlHTMLAttributes<HTMLDivElement> {
  uiStore: UIStore;
  TalkFooterMenu?: React.ReactNode[];
  attachmentStore: AttachmentStore;
  MessageInput?: React.ReactNode;
  SendButton?: React.ReactNode;
  EmoticonButton?: React.ReactNode;
  MentionButton?: React.ReactNode;
}

const TalkFooter = observer((props: TalkFooterProps) => {
  const {
    uiStore,
    attachmentStore,
    TalkFooterMenu,
    MessageInput,
    SendButton,
    EmoticonButton,
    MentionButton,
    style,
  } = props;
  const location = useLocation();

  const { configStore } = useStore();

  return (
    <S.MessageWrap>
      {uiStore.openReplyInfo && <ReplyInfo />}
      {uiStore.openMention && <MentionModal />}
      <Attachments />
      <S.Wrapper style={{ ...style }}>
        <S.AttachWrapper>{TalkFooterMenu}</S.AttachWrapper>
        <S.FooterWrapper>
          <S.InputWrapper>{MessageInput}</S.InputWrapper>
          <S.MenuWrapper>
            {configStore.FooterType === 'Large' && MentionButton}
            {EmoticonButton} {SendButton}
          </S.MenuWrapper>
        </S.FooterWrapper>
        {!attachmentStore.readyToUpload && <UploadLoading />}
      </S.Wrapper>
      {location.pathname.includes('bottomItems') && <TalkBottom />}
    </S.MessageWrap>
  );
});

export default TalkFooter;
