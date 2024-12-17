import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Virtuoso, VirtuosoHandle, ListItem } from 'react-virtuoso';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import Mention from '@/components/Common/MentionModal';
import MessageLoadFail from '@/components/Common/MessageLoadFail';
import UserProfileDialog from '@/components/Desktop/Dialogs/UserProfileDialog';
import StickerPreview from '@/components/Desktop/TalkFooter/StickerPreview';
import { MESSAGE_SIZE } from '@/constants';
import { ErrorBoundary } from '@/lib';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';

import isDarkMode from '../../../utils/darkModeDetect';
import DeliverDialog from '../Dialogs/DeliverDialog';
import RoomLinkShare from '../Dialogs/RoomLinkShare';
import MediaPreview from '../MediaPreview';
import MailModal from '../TalkFooter/Modal/MailModal';
import ReserveModal from '../TalkFooter/Modal/ReserveModal';
import VoteModal from '../TalkFooter/Modal/VoteModal';

import Message from './Message';
import NewIncomingMessage from './NewIncomingMessage';
import Notice from './Notice';
import NoticeDialog from './Notice/NoticeDialog';
import * as S from './styled';

const TalkBody = observer(() => {
  const { messageStore, uiStore, emoticonStore, configStore } = useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();

  const stickerVisible = useObserver(() => uiStore.openStickerPreview);
  const allMessages = computed(() => messageStore.messages).get();

  const [atBottom, setAtBottom] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showToReplyButton, setShowToReplyButton] = useState(false);
  const [showNewMsgButton, setShowNewMsgButton] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [bottomScrollActivate, setBottomScrollActivate] = useState(false);

  const showButtonTimeoutRef = useRef<
    undefined | ReturnType<typeof setTimeout>
  >(undefined);

  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const roomEnterTime = currentRoom?.myInfo?.joinDate as string;

  const roomId = useMemo(
    () => roomStore.currentRoomId || -1,
    [roomStore.currentRoomId],
  );
  const name = useMemo(
    () => roomStore.getRoomById(roomStore.currentRoomId as number)?.name || '',
    [roomStore.currentRoomId],
  );
  const email = useMemo(
    () => roomStore.getRoomById(roomStore.currentRoomId as number)?.mail || '',
    [roomStore.currentRoomId],
  );

  const handleCloseDialog = useCallback(() => {
    uiStore.closeDialog('notice');
  }, []);
  const handleConfirmDeletedNotice = useCallback(() => {
    uiStore.closeDialog('confirmDeletedNotice');
  }, []);
  const handleCloseVote = useCallback(() => {
    uiStore.closeDialog('vote');
  }, []);
  const handleCloseDeletedVote = useCallback(() => {
    uiStore.closeDialog('deletedVote');
  }, []);
  const handleCloseInvalidFile = useCallback(() => {
    uiStore.closeDialog('invalidFile');
  }, []);
  const handleCloseUploadFailed = useCallback(() => {
    uiStore.setUploadFailedFileNames([]);
  }, []);

  const handleCloseMailModal = useCallback(() => {
    uiStore.closeDialog('mail');
    uiStore.setMailDialogMode('writeNew');
    uiStore.setMailViewId(-1);
  }, []);

  const handleClickReplyMessage = useCallback(async () => {
    setShowToReplyButton(false);
    messageStore.setGotoReplyOriginTargetId(messageStore.replyMessageId);
    messageStore.setParentMessageId(-1);
    await messageStore.scrollToTargetMessageId(
      messageStore.replyMessageId as number,
      'center',
      roomEnterTime as string,
    );
    messageStore.setReplyMessageId(-1);
  }, [messageStore.replyMessageId]);

  const handleItemsRendered = useCallback(
    (items: ListItem<MessageModel>[]) => {
      if (isFirstRender) setIsFirstRender(false);
      const visibleMsgIds = items.map((item) => item.data?.msgId);
      // 답장으로 이동 btn 보이게 하기
      if (
        !showToReplyButton &&
        messageStore.replyMessageId !== -1 &&
        visibleMsgIds.includes(messageStore.parentMessageId)
      ) {
        setShowToReplyButton(true);
      }

      // 답장으로 이동 btn 보이고 범위 벗어날 때
      if (
        showToReplyButton &&
        messageStore.isScrolling &&
        !visibleMsgIds.includes(messageStore.parentMessageId)
      ) {
        setShowToReplyButton(false);
        messageStore.setParentMessageId(-1);
        messageStore.setReplyMessageId(-1);
      }
    },
    [
      messageStore.isScrolling,
      messageStore.replyMessageId,
      messageStore.parentMessageId,
    ],
  );

  const prependUpperItems = useCallback(async () => {
    if (messageStore.upHasMore) {
      const targetId = messageStore.messages[0].msgId;
      await messageStore.getMessages({
        targetId,
        upSize: MESSAGE_SIZE,
        roomEnterTime,
      });
      if (bottomScrollActivate && !atBottom) {
        messageStore.scrollToBottom('auto');
        setBottomScrollActivate(false);
      }
    }
  }, [messageStore.firstItemIndex]);
  const prependLowerItems = useCallback(async () => {
    if (messageStore.downHasMore) {
      const targetId =
        messageStore.messages[messageStore.messages.length - 1].msgId;
      await messageStore.getMessages({
        targetId,
        downSize: MESSAGE_SIZE,
        roomEnterTime,
      });
    }
  }, []);

  const handleAtBottomStateChange = useCallback((bottom: boolean) => {
    if (bottom && !messageStore.downHasMore) {
      setAtBottom(true);
      messageStore.setIsScrollBottom(true);
    } else {
      setAtBottom(false);
      messageStore.setIsScrollBottom(false);
    }
  }, []);
  const handleClickDownScrollButton = useCallback(() => {
    setBottomScrollActivate(true);
    messageStore.scrollToBottom('auto');
  }, []);
  const handleFollowOutput = useCallback(
    (isAtBottom: boolean) => {
      if (messageStore.isInit) {
        return 'smooth';
      }
      if (isAtBottom && !messageStore.downHasMore) {
        return 'auto';
      }
      return false;
    },
    [messageStore.isInit],
  );
  const handleVirtuousoRef = useCallback((ref: VirtuosoHandle) => {
    messageStore.setVirtuosoRef(ref);
  }, []);

  const handleItemContent = useCallback((i: number, message: MessageModel) => {
    return <Message key={message.msgId} message={message} />;
  }, []);

  const handleIsScrolling = (isScrolling: boolean) => {
    messageStore.setIsScrolling(isScrolling);
  };

  const uploadFailedDescription = () => {
    const uploadFailedFilesLength = uiStore.uploadFailedFileNames.length;
    const firstFailedFileName = uiStore.uploadFailedFileNames?.[0];

    if (uploadFailedFilesLength === 1) {
      return `알 수 없는 오류로 ${firstFailedFileName} 파일이 전송되지 않았습니다.`;
    } else if (uploadFailedFilesLength > 1) {
      return `알 수 없는 오류로 ${firstFailedFileName}외 ${
        uploadFailedFilesLength - 1
      }개의 파일이 전송되지 않았습니다.`;
    }
  };

  useEffect(() => {
    messageStore.setGotoReplyOriginTargetId(-1);
    messageStore.setReplyMessageId(-1);
    messageStore.setParentMessageId(-1);
    messageStore.setNewIncomingMessage(null);
    setShowToReplyButton(false);
    setIsFirstRender(true);
    handleCloseMailModal();
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    return () => {
      clearTimeout(showButtonTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
    } else {
      setShowButton(false);
      setShowNewMsgButton(false);
      setBottomScrollActivate(false);
    }
  }, [atBottom, setShowButton]);

  useEffect(() => {
    if (messageStore.newIncomingMessage && !atBottom) {
      setShowNewMsgButton(true);
      setShowButton(false);
    }
  }, [messageStore.newIncomingMessage]);

  useEffect(() => {
    if (!isFirstRender && messageStore.targetId !== -1) {
      messageStore.scrollToTargetMessageId(messageStore.targetId);
    }
  }, [isFirstRender, messageStore.targetId]);

  useEffect(() => {
    if (messageStore.replyMessageId === -1) {
      setShowToReplyButton(false);
    }
  }, [messageStore.replyMessageId]);

  if (uiStore.openGetMessageFail) return <MessageLoadFail />;
  return (
    <S.Wrapper
      id="talk-body"
      className="TalkBody"
      color={isDarkMode() ? '#1C1C1E' : configStore.BodyColor}
    >
      {configStore.FooterMenuItems.Notice &&
        configStore.MessageMenu.includes('notice') && <Notice />}
      <div id="modal"></div>
      <NoticeDialog open={uiStore.openNotice} onClose={handleCloseDialog} />
      <VoteModal open={uiStore.openVote} onClose={handleCloseVote} />
      <ReserveModal />
      {uiStore.openMail && (
        <MailModal
          open={uiStore.openMail}
          onClose={handleCloseMailModal}
          setModalType={uiStore.setMailDialogMode}
          roomId={roomId}
          name={name}
          email={email}
        />
      )}
      <ConfirmDialog
        open={uiStore.confirmDeletedNotice}
        title={'삭제된 공지입니다.'}
        onClickOk={handleConfirmDeletedNotice}
      />
      <ConfirmDialog
        open={uiStore.deletedVote}
        title={'삭제된 투표입니다.'}
        description={'투표가 삭제되어 결과를 확인할 수 없습니다.'}
        onClose={handleCloseDeletedVote}
        onClickOk={handleCloseDeletedVote}
      />
      <ConfirmDialog
        open={uiStore.invalidFile}
        title={'원본 파일이 삭제되었습니다.'}
        onClickOk={handleCloseInvalidFile}
      />
      <ConfirmDialog
        open={uiStore.uploadFailedFileNames.length > 0}
        title={'부분 전송 실패'}
        description={uploadFailedDescription()}
        onClickOk={handleCloseUploadFailed}
      />
      <DeliverDialog />
      <RoomLinkShare />
      {uiStore.desktopProfileAnchorEl && <UserProfileDialog />}

      {messageStore.isInit ? null : (
        <ErrorBoundary>
          <Virtuoso
            width={'100%'}
            height={'100%'}
            ref={handleVirtuousoRef}
            firstItemIndex={messageStore.firstItemIndex}
            data={allMessages}
            initialTopMostItemIndex={{
              align: 'center',
              index: messageStore.getMyLastReadMsgIndex(isFirstRender),
            }}
            startReached={prependUpperItems}
            endReached={prependLowerItems}
            itemContent={handleItemContent}
            atBottomStateChange={handleAtBottomStateChange}
            followOutput={handleFollowOutput}
            defaultItemHeight={58}
            className="virtuosoArea"
            itemsRendered={handleItemsRendered}
            isScrolling={handleIsScrolling}
          />
        </ErrorBoundary>
      )}
      {showButton && (
        <S.ScrollDownButton onClick={handleClickDownScrollButton}>
          <Squircle
            size={48}
            icon={
              messageStore.state === 'loading' ? (
                <Icon.Loading2Motion
                  width={24}
                  height={24}
                  color={configStore.FloatingButtonColor}
                />
              ) : (
                <Icon.ArrowBottomLine
                  width={24}
                  height={24}
                  color={configStore.FloatingButtonColor}
                />
              )
            }
            color={configStore.FloatingButtonBackgroundColor}
          />
        </S.ScrollDownButton>
      )}

      {stickerVisible && (
        <StickerPreview emoticonStore={emoticonStore} uiStore={uiStore} />
      )}
      {uiStore.openMediaPreview && <MediaPreview />}
      {uiStore.openMention && <Mention />}
      <S.BottomButtonsWrapper>
        {showToReplyButton && (
          <S.ScrollToReplyButton onClick={handleClickReplyMessage}>
            답장으로 이동
            <Icon.ArrowBottomLine
              width={16}
              height={16}
              color={Color.White[0]}
            />
          </S.ScrollToReplyButton>
        )}
        {showNewMsgButton && messageStore.newIncomingMessage && (
          <S.ScrollToNewMsgButton onClick={handleClickDownScrollButton}>
            <NewIncomingMessage message={messageStore.newIncomingMessage} />
          </S.ScrollToNewMsgButton>
        )}
      </S.BottomButtonsWrapper>
    </S.Wrapper>
  );
});

export default TalkBody;
