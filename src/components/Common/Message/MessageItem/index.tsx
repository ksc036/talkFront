import React, { useEffect, useState } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import MessageItemMenu from '@/components/Desktop/TalkBody/Message/MessageItemMenu';
import StatusButton from '@/components/Desktop/TalkBody/Message/MessageStatus';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { timeStampFormat, isMobile, getRoomType } from '@/utils';

import AlarmBotMessage from './AlarmBotMessage';
import AutoMessage from './AutoMessage';
import BlindedMessage from './BlindedMessage';
import CalendarMessage from './CalendarMessage';
import ContactMessage from './ContactMessage';
import DeletedMessage from './DeletedMessage';
import FileMessage from './FileMessage';
import MailMessage from './MailMessage';
import MediaMessage from './MediaMessage';
import MeetingMessage from './MeetingMessage';
import NoticeMessage from './NoticeMessage';
import StickerMessage from './StickerMessage';
import * as S from './styled';
import TextMessage from './TextMessage';
import URLMessage from './URLMessage';
import VoteMessage from './VoteMessage';

export interface MessageItemProps {
  message: MessageModel;
}

const MessageItem = observer((props: MessageItemProps) => {
  const { message } = props;
  const { messageStore, uiStore, configStore, talkStore } = useStore();
  const { roomStore, personaStore, userStore } = useCoreStore();
  const { Color } = useTheme();
  const { appId } = talkStore;

  const [bounce, setBounce] = useState<boolean>(false);

  const isMine =
    message.personaId === (userStore.selectedPersona?.id as number) &&
    !message.msgType.includes('autoMsg');

  const roomEnterTime = roomStore.getRoomById(roomStore.currentRoomId as number)
    ?.myInfo?.joinDate as string;

  const handleClickMessage = async () => {
    // 답장 메시지의 원본 메시지가 있고, 메시지가 드래그되지 않는 경우에만 원본 메시지로 이동
    if (
      message.parentBody?.isDeleted !== 0 ||
      window?.getSelection()?.toString()
    )
      return;

    if (message.parentId && message.parentBody) {
      messageStore.setParentMessageId(-1);
      messageStore.setReplyMessageId(-1);
      messageStore.setGotoReplyOriginTargetId(message.parentId);
      await messageStore.scrollToTargetMessageId(
        message.parentId as number,
        'center',
        roomEnterTime as string,
      );
      messageStore.setReplyMessageId(message.msgId);
      messageStore.setParentMessageId(message.parentId);
    }
  };

  const isUrlMessage =
    message.msgBody.ogTitle ||
    message.msgBody.ogDescription ||
    message.msgBody.ogImageUrl;

  const isMessageMenuVisible =
    !message.isDeleted &&
    !message.isAutoMessage &&
    !message.isBotMessage &&
    configStore.MessageMenu.length > 0;

  const handleOpenToast = (message: string) => {
    uiStore.openToast(message);
  };

  const isOpenRoom = false; // true
  const currentRoom = roomStore.getRoomById(roomStore.currentRoomId as number);
  const personaCount = currentRoom?.personaCount;
  const getUnread = () => {
    if (!isOpenRoom || !personaCount) return message.unReadCount;
    const unReadPercent = (message.unReadCount / personaCount) * 100;
    return unReadPercent.toFixed(0) + '%';
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (
      message.msgId ===
        messageStore.searchResultIds[messageStore.searchIndex] ||
      message.msgId === messageStore.gotoReplyOriginTargetId ||
      message.msgId === messageStore.targetId
    ) {
      setBounce(true);
      timeout = setTimeout(() => {
        if (messageStore.gotoReplyOriginTargetId >= 0) {
          messageStore.setGotoReplyOriginTargetId(-1);
        }
        setBounce(false);
        messageStore.setTargetId(-1);
      }, 1500);
    }
    return () => {
      clearTimeout(timeout);
      setBounce(false);
    };
  }, [
    messageStore.gotoReplyOriginTargetId,
    messageStore.setGotoReplyOriginTargetId,
    messageStore.searchResultIds,
    messageStore.searchIndex,
    messageStore.targetId,
  ]);

  if (message.isAutoMessage) {
    return <AutoMessage message={message} />;
  }

  // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
  // if (personaStore.getPersona(message.personaId)?.isBlocked) {
  //   return <DeletedMessage isMine={isMine} isBlocked={true} />;
  // }

  return (
    <S.MessageItemWrapper isCurrent={bounce} isMine={isMine}>
      {/* 부모 메시지 (자식 메시지가 삭제되지 않은 상태여야 부모 메시지가 보임.) */}
      {message.isDeleted === 0 && message.parentId && !!message.parentBody && (
        <S.ParentMessageWrapper onClick={handleClickMessage} isMine={isMine}>
          {(message.parentBody.msgType.includes('sticker') ||
            message.parentBody.msgType.includes('file') ||
            message.parentBody.msgType.includes('image') ||
            message.parentBody.msgType.includes('video') ||
            message.parentBody.msgType.includes('notice') ||
            message.parentBody.msgType.includes('vote') ||
            message.parentBody.msgType.includes('meeting') ||
            message.parentBody.msgType.includes('contact') ||
            (message.parentBody.msgType.includes('mail') &&
              !message.msgType.includes('mail'))) && (
            <S.ReplyTextWrapper>
              <Icon.ReplyLine width={16} height={16} color={Color.Black[40]} />
              <S.ReplyBoldText color={Color.Gray[700]}>
                {personaStore.getPersona(message.parentBody.personaId)?.nick ??
                  ''}
              </S.ReplyBoldText>
              <S.ReplyText color={Color.Gray[600]}>에게 답장</S.ReplyText>
            </S.ReplyTextWrapper>
          )}
          {/* 부모 메시지가 삭제되지 않은 경우 */}
          {message.parentBody?.isDeleted === 0 && (
            <>
              {message.parentBody?.msgType.includes('mail') &&
                (message.msgType.includes('mail') ? (
                  <>
                    <S.ReplyTextWrapper>
                      <Icon.ReplyLine
                        width={16}
                        height={16}
                        color={Color.App.talk}
                      />
                      <S.ReplyText>메일 답장</S.ReplyText>
                    </S.ReplyTextWrapper>
                    <MailMessage
                      msgId={message.parentId}
                      msgBody={message.parentBody.msgBody}
                      isMailReply={true}
                      isMine={isMine}
                    />
                  </>
                ) : (
                  <MailMessage
                    msgId={message.parentId}
                    msgBody={message.parentBody?.msgBody}
                    isReply={true}
                  />
                ))}
              {(message.parentBody?.msgType.includes('text') ||
                (message.parentBody.msgType.includes('bot') &&
                  message.parentBody.msgType.includes('url'))) &&
                !message.msgType.includes('text') && (
                  <TextMessage
                    message={message}
                    msgId={message.msgId}
                    msgType={message.msgType}
                    isMine={isMine}
                  />
                )}
              {message.parentBody?.msgType.includes('sticker') && (
                <StickerMessage
                  sticker={message.parentBody?.msgBody?.sticker ?? ''}
                  isReply={true}
                />
              )}
              {message.parentBody?.msgType.includes('notice') && (
                <NoticeMessage
                  msgBody={message.parentBody?.msgBody}
                  msgId={message.parentId}
                  msgType={message.parentBody?.msgType}
                  isReply={true}
                />
              )}
              {message.parentBody?.msgType.includes('vote') && (
                <VoteMessage
                  msgBody={message.parentBody?.msgBody}
                  msgId={message.parentId}
                  isReply={true}
                />
              )}
              {message.parentBody?.msgType.includes('file') && (
                <FileMessage message={message} isReply={true} />
              )}
              {(message.parentBody?.msgType.includes('image') ||
                message.parentBody?.msgType.includes('video')) && (
                <MediaMessage message={message} isReply={true} />
              )}
              {message.parentBody?.msgType.includes('meeting') && (
                <MeetingMessage
                  message={message}
                  msgId={message.parentId}
                  isReply={true}
                />
              )}
              {message.parentBody?.msgType.includes('calendar') && (
                <CalendarMessage message={message} isReply={true} />
              )}
              {message.parentBody?.msgType.includes('contact') && (
                <ContactMessage message={message} isReply={true} />
              )}
            </>
          )}
          {/* 부모 메시지가 삭제된 경우 */}
          {message.parentBody?.isDeleted !== 0 &&
            !message.parentBody?.msgType.includes('text') && (
              <DeletedMessage isMine={isMine} isReply={true} />
            )}
        </S.ParentMessageWrapper>
      )}
      {/* 실제 메시지 */}
      {message.isDeleted === 0 && isUrlMessage && (
        <TextMessage
          message={message}
          msgId={message.msgId}
          msgType={message.msgType}
          isMine={isMine}
          getMention={true}
          handleClick={handleClickMessage}
          isEditor={message.msgType.includes('editor')}
        />
      )}
      {message.msgType.includes('text') &&
        message.msgType.includes('sticker') &&
        message.isDeleted === 0 && (
          <StickerMessage sticker={message.msgBody.sticker ?? ''} />
        )}
      <S.MessageItem isMine={isMine}>
        {message.isDeleted === 0 && (
          <>
            {!message.msgType.includes('text') &&
              message.msgType.includes('sticker') && (
                <StickerMessage sticker={message.msgBody.sticker ?? ''} />
              )}
            {(((message.msgType.includes('text') ||
              message.msgType.includes('editor')) &&
              !isUrlMessage) ||
              message.isWelcomeMessage ||
              message.isRoomShareLink) && (
              <TextMessage
                message={message}
                msgId={message.msgId}
                msgType={message.msgType}
                isMine={isMine}
                getMention={true}
                handleClick={handleClickMessage}
                isEditor={message.msgType.includes('editor')}
              />
            )}
            {message.msgType.includes('file') && (
              <FileMessage message={message} />
            )}
            {(message.msgType.includes('image') ||
              message.msgType.includes('video')) && (
              <MediaMessage message={message} />
            )}
            {message.msgType.includes('notice') && (
              <NoticeMessage
                msgBody={message.msgBody}
                msgId={message.msgId}
                msgType={message.msgType}
              />
            )}
            {message.msgType.includes('vote') && (
              <VoteMessage msgBody={message.msgBody} msgId={message.msgId} />
            )}
            {message.msgType.includes('meeting') && (
              <MeetingMessage message={message} msgId={message.msgId} />
            )}
            {message.msgType.includes('calendar') && (
              <CalendarMessage message={message} />
            )}
            {message.msgType.includes('contact') && (
              <ContactMessage message={message} />
            )}
            {message.msgType.includes('mail') && (
              <MailMessage msgId={message.msgId} msgBody={message.msgBody} />
            )}
            {isUrlMessage && (
              <URLMessage
                msgBody={message.msgBody}
                isForBody={true}
                isMine={isMine}
              />
            )}
            {message.isBotMessage && (
              <>
                <AlarmBotMessage
                  msgId={message.msgId}
                  msgBody={message.msgBody}
                  message={message}
                />
              </>
            )}
          </>
        )}
        {message.isDeleted === 1 && <DeletedMessage isMine={isMine} />}
        {(message.isDeleted === 2 || message.isDeleted === 3) && (
          <BlindedMessage isMine={isMine} deletedFrom={message.isDeleted} />
        )}
        {!message.msgType.includes('autoMsg') && (
          <S.MessageInfoWrapper>
            {message.tempId ? (
              <StatusButton message={message} />
            ) : !isMobile() &&
              messageStore.hoveredMessageId === message.msgId &&
              isMessageMenuVisible ? (
              <S.MessageMenu isMine={isMine}>
                <MessageItemMenu
                  message={message}
                  openToast={handleOpenToast}
                  isMine={isMine}
                />
              </S.MessageMenu>
            ) : (
              <S.MessageInfo isMine={isMine}>
                {!isMessageMenuVisible || !message.unReadCount ? null : (
                  <S.UnreadCount color={configStore.config.MainColor}>
                    {getUnread()}
                  </S.UnreadCount>
                )}
                {message.isTail && (
                  <S.SendDate>
                    {timeStampFormat(message.createdAt, 'a hh:mm')}
                  </S.SendDate>
                )}
              </S.MessageInfo>
            )}
          </S.MessageInfoWrapper>
        )}
      </S.MessageItem>
    </S.MessageItemWrapper>
  );
});

export default MessageItem;
