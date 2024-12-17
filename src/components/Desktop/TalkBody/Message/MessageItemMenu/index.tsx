import React, { useRef, useState } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { getAuthority } from '@/utils';

import EtcButton from './EtcButton';
import ReactionButton from './ReactionButton';
import ReplyButton from './ReplyButton';
import * as S from './styled';

interface MessageItemMenuProps {
  message: MessageModel;
  openToast: (message: string) => void;
  isMine: boolean;
}

const MessageItemMenu = (props: MessageItemMenuProps) => {
  const { message, openToast, isMine } = props;
  const { configStore, uiStore, talkStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [menuType, setMenuType] = useState('');

  const handleOpenMenu = (type: string) => {
    setAnchorEl(menuRef.current);
    setMenuType(type);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuType('');
  };

  const authority = getAuthority(
    message,
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    userStore.selectedPersona,
  );

  const menuActivate = {
    // 답장
    reply:
      uiStore.showMessageMenus && configStore.MessageMenu.includes('reply'),
    // 공감
    reaction:
      uiStore.showMessageMenus && configStore.MessageMenu.includes('reaction'),
    // 복사
    copy:
      (message.msgType.includes('text') ||
        message.msgType.includes('editor')) &&
      !message.msgType.includes('meeting') &&
      configStore.MessageMenu.includes('copy'),
    // 저장
    save:
      message.msgType.includes('file') ||
      message.msgType.includes('image') ||
      message.msgType.includes('video'),
    // 전달
    deliver:
      !talkStore.isMini &&
      !message.msgType.includes('vote') &&
      !message.msgType.includes('notice') &&
      !message.msgType.includes('meeting') &&
      !message.msgType.includes('mail') &&
      !message.msgType.includes('calendar') &&
      configStore.MessageMenu.includes('deliver'),
    // 공지
    notice:
      (message.msgType.includes('text') ||
        message.msgType.includes('editor')) &&
      !message.msgType.includes('meeting') &&
      configStore.MessageMenu.includes('notice'),
    // 안 읽은 인원
    unreadUser:
      !authority.isMyRoom &&
      message.unReadCount !== 0 &&
      configStore.MessageMenu.includes('unreadUser'),
    // 삭제
    delete: authority.isMine && configStore.MessageMenu.includes('delete'),
    // 블라인드
    blind:
      configStore.MessageMenu.includes('blind') &&
      !!(authority.isRoomLeader || authority.isAdmin),
    // 신고
    report:
      !authority.isMine &&
      (message.msgType.includes('text') ||
        message.msgType.includes('file') ||
        message.msgType.includes('url')) &&
      !message.msgType.includes('meeting') &&
      !message.msgType.includes('vote') &&
      !message.msgType.includes('notice') &&
      configStore.MessageMenu.includes('report'),
  };

  // 더보기
  const { reply, reaction, ...etc } = menuActivate;
  const etcActivate = !Object.values(etc).every((val) => !val);

  return (
    <S.MenuWrapper ref={menuRef}>
      {reply && <ReplyButton messageId={message.msgId} />}

      {reaction && (
        <ReactionButton
          messageId={message.msgId}
          anchorEl={anchorEl}
          openEmojiMenu={() => handleOpenMenu('Emoji')}
          closeEmojiMenu={handleCloseMenu}
          menuType={menuType}
          isMine={isMine}
        />
      )}
      {etcActivate && (
        <EtcButton
          message={message}
          openEmojiMenu={() => handleOpenMenu('Emoji')}
          anchorEl={anchorEl}
          openUnreadMenu={() => handleOpenMenu('Unread')}
          closeUnreadMenu={handleCloseMenu}
          openToast={openToast}
          menuType={menuType}
          menuActivate={menuActivate}
          isMine={isMine}
        />
      )}
    </S.MenuWrapper>
  );
};

export default MessageItemMenu;
