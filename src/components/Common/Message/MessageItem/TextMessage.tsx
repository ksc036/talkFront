import React from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import { MessageType } from '@/@types';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { isMobile } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';
import { getHTMLStringText } from '@/utils/editor';

import PlainMessage from './PlainMessage';
import * as S from './styled';

interface TextMessageProps {
  isMine: boolean;
  msgId: number;
  message: MessageModel;
  msgType: MessageType[];
  getLink?: boolean;
  getMention?: boolean;
  handleClick?: () => Promise<void>;
  isEditor?: boolean;
}

const TextMessage = observer((props: TextMessageProps) => {
  const {
    isMine,
    msgId,
    message,
    msgType,
    getLink,
    getMention,
    handleClick,
    isEditor,
  } = props;
  const { personaStore } = useCoreStore();
  const { configStore } = useStore();

  // 텍스트인 부모 영역이 있는지 여부
  const hasParentText =
    message.parentBody?.msgType.includes('text') ||
    message.parentBody?.msgType.includes('editor') ||
    (message.parentBody?.msgType.includes('url') &&
      message.parentBody?.msgType.includes('bot'));

  // 텍스트인 답장 영역(실제 메시지)이 있는지 여부
  const hasTextContent =
    message.msgType.includes('text') ||
    message.msgType.includes('editor') ||
    message.isWelcomeMessage ||
    message.isRoomShareLink;

  const handleClickTextMessage = () => {
    if (hasParentText && handleClick) {
      handleClick();
    }
  };

  const parent = !!message.parentBody && message.parentId && hasParentText && (
    <S.ParentWrapper isReplyCombined={hasTextContent}>
      {isMine ? (
        <>
          <S.ReplyTextWrapper>
            <S.ReplyBoldText color={configStore.MyMessageStyle.ReplyNameColor}>
              {personaStore.getPersona(message.parentBody.personaId)?.nick}
            </S.ReplyBoldText>
            <S.ReplyText color={configStore.MyMessageStyle.ReplyToColor}>
              에게 답장
            </S.ReplyText>
          </S.ReplyTextWrapper>
          <S.MyMessage
            isReply={true}
            replyColor={configStore.MyMessageStyle.ReplyMessageColor}
          >
            {message.parentBody?.isDeleted === 0 ? (
              <PlainMessage
                msgId={message.parentId}
                content={
                  message.parentBody.msgType.includes('editor')
                    ? getHTMLStringText(message.parentContent)
                    : message.parentContent
                }
                getLink={false}
                getShort={true}
                isMine={true}
                allowKeywordSearch={false}
                ogUrl={message.msgBody?.ogUrl}
              />
            ) : (
              <>{'삭제된 메시지입니다.'}</>
            )}
          </S.MyMessage>
        </>
      ) : (
        <>
          <S.ReplyTextWrapper>
            <S.ReplyBoldText
              color={configStore.OtherMessageStyle.ReplyNameColor}
            >
              {personaStore.getPersona(message.parentBody.personaId)?.nick}
            </S.ReplyBoldText>
            <S.ReplyText color={configStore.OtherMessageStyle.ReplyToColor}>
              에게 답장
            </S.ReplyText>
          </S.ReplyTextWrapper>
          <S.OtherMessage isReply={true}>
            {message.parentBody?.isDeleted === 0 ? (
              <PlainMessage
                msgId={message.parentId}
                content={message.parentContent}
                getLink={false}
                getShort={true}
                isMine={false}
                allowKeywordSearch={false}
                ogUrl={message.msgBody?.ogUrl}
              />
            ) : (
              <>{'삭제된 메시지입니다.'}</>
            )}
          </S.OtherMessage>
        </>
      )}
    </S.ParentWrapper>
  );

  return isMine ? (
    <S.MyMessageWrapper
      hasReply={msgType.includes('text')}
      onClick={handleClickTextMessage}
    >
      <S.MyContentWrapper
        className="MyMessage"
        color={configStore.MyMessageStyle.BackgroundColor}
        isMobile={isMobile()}
      >
        <S.MsgTip
          color={configStore.MyMessageStyle.BackgroundColor}
          isMine={isMine}
        />
        {hasParentText && parent}
        {hasTextContent && (
          <S.MyMessage
            className="TextMessage"
            color={configStore.MyMessageStyle.TextColor}
          >
            {hasParentText && (
              <div style={{ minWidth: '16px', marginRight: '8px' }}>
                <Icon.ReplyLine
                  width={18}
                  height={18}
                  color={configStore.MyMessageStyle.ReplyArrowColor}
                />
              </div>
            )}
            {message.isDeleted === 0 ? (
              <PlainMessage
                msgId={msgId}
                content={message.content}
                getLink={getLink}
                getMention={getMention}
                isMine={true}
                allowKeywordSearch={true}
                ogUrl={message.msgBody?.ogUrl}
                isEditor={isEditor}
                rawContent={message.rawContent}
              />
            ) : (
              <>{'삭제된 메시지입니다.'}</>
            )}
          </S.MyMessage>
        )}
      </S.MyContentWrapper>
    </S.MyMessageWrapper>
  ) : (
    <S.OtherMessageWrapper
      hasReply={msgType.includes('text')}
      onClick={handleClickTextMessage}
    >
      <S.OtherContentWrapper
        className="OtherMessage"
        color={
          isDarkMode()
            ? '#3C4043'
            : configStore.OtherMessageStyle.BackgroundColor
        }
        isMobile={isMobile()}
      >
        <S.MsgTip
          color={configStore.OtherMessageStyle.BackgroundColor}
          isMine={isMine}
        />
        {hasParentText && parent}
        {hasTextContent && (
          <S.OtherMessage
            className="TextMessage"
            color={
              isDarkMode() ? 'white' : configStore.OtherMessageStyle.TextColor
            }
          >
            {hasParentText && (
              <div style={{ minWidth: '16px', marginRight: '8px' }}>
                <Icon.ReplyLine
                  width={18}
                  height={18}
                  color={configStore.OtherMessageStyle.ReplyArrowColor}
                />
              </div>
            )}
            <PlainMessage
              msgId={msgId}
              content={message.content}
              getLink={getLink}
              getMention={getMention}
              isMine={false}
              allowKeywordSearch={true}
              ogUrl={message.msgBody?.ogUrl}
              isEditor={isEditor}
              rawContent={message.rawContent}
            />
          </S.OtherMessage>
        )}
      </S.OtherContentWrapper>
    </S.OtherMessageWrapper>
  );
});

export default TextMessage;
