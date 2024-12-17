import React, { HtmlHTMLAttributes } from 'react';

import { observer } from 'mobx-react';

import Attachments from '@/components/Desktop/TalkFooter/Attachments';
import * as S from '@/components/Desktop/TalkFooter/LargeFooter/FooterTemplate/Styled';
import ReplyInfo from '@/components/Desktop/TalkFooter/ReplyInfo';
import { EditorStore } from '@/stores/EditorStore';
import { UIStore } from '@/stores/UIStore';

interface TalkFooterProps extends HtmlHTMLAttributes<HTMLDivElement> {
  uiStore: UIStore;
  editorStore: EditorStore;
  TalkFooterMenu?: React.ReactNode[];
  MessageInput?: React.ReactNode;
  SendButton?: React.ReactNode;
  count: React.ReactNode;
}

const TalkFooter = observer((props: TalkFooterProps) => {
  const {
    uiStore,
    editorStore,
    TalkFooterMenu,
    MessageInput,
    SendButton,
    count,
    style,
  } = props;
  return (
    <S.messageWrap>
      {uiStore.openReplyInfo && <ReplyInfo />}
      <Attachments />
      <S.Wrapper style={{ ...style }} onClick={() => editorStore.focus()}>
        <S.InputWrapper>{MessageInput}</S.InputWrapper>
      </S.Wrapper>
      <S.MenuWrapper>
        {TalkFooterMenu} {count} {SendButton}
      </S.MenuWrapper>
    </S.messageWrap>
  );
});

export default TalkFooter;
