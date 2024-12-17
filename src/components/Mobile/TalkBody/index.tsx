import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle, ListItem } from 'react-virtuoso';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, Mui, Squircle, useTheme } from '@wapl/ui';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import MessageLoadFail from '@/components/Common/MessageLoadFail';
import ConfirmDialog from '@/components/Mobile/Dialogs/ConfirmDialog';
import LinksDialog from '@/components/Mobile/Dialogs/LinksDialog';
import StickerPreview from '@/components/Mobile/TalkFooter/StickerPreview';
import { MESSAGE_SIZE } from '@/constants';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';

import DeliverContextMenu from '../Dialogs/Deliver/DeliverContextMenu';
import DeliverDialog from '../Dialogs/Deliver/DeliverDialog';
import MemberInviteDialog from '../Dialogs/MemberInviteDialog';
import UnreadUserDialog from '../Dialogs/UnreadUser';
import MediaPreview from '../MediaPreview';
import Notice from '../Notice';
import NoticeDialog from '../Notice/NoticeDialog';
import ReserveDialog from '../Reserve';
import VoteDialog from '../VoteDialog';

import Message from './Message';
import CalendarContextMenu from './Message/CalendarContextMenu';
import MessageContextMenu from './Message/MessageContextMenu';
import ReactionDialog from './Message/ReactionChip/ReactionDialog';
import NewIncomingMessage from './NewIncomingMessage';
import * as S from './styled';

const TalkBody = observer(() => {
  const { uiStore, messageStore, emoticonStore, talkStore, configStore } =
    useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();

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

  const handleCloseToast = () => {
    uiStore.closeToast();
  };

  const handleClickReplyMessage = useCallback(async () => {
    setShowToReplyButton(false);
    messageStore.setGotoReplyOriginTargetId(messageStore.replyMessageId);
    messageStore.setParentMessageId(-1);
    await messageStore.scrollToTargetMessageId(
      messageStore.replyMessageId as number,
      'center',
      roomEnterTime,
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

  const handleIsScrolling = useCallback((isScrolling: boolean) => {
    messageStore.setIsScrolling(isScrolling);
  }, []);

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
  const handleCloseDeletedVote = useCallback(() => {
    uiStore.closeDialog('deletedVote');
  }, []);
  const handleCloseConfirmDeletedNotice = useCallback(() => {
    uiStore.closeDialog('confirmDeletedNotice');
  }, []);
  const handleCloseInvalidFile = useCallback(() => {
    uiStore.closeDialog('invalidFile');
  }, []);
  const handleCloseUploadFailed = useCallback(() => {
    uiStore.setUploadFailedFileNames([]);
  }, []);

  const handleItemContent = useCallback((i: number, message: MessageModel) => {
    return <Message key={message.msgId} message={message} />;
  }, []);

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

  const handleCancelZipDownload = () => {
    uiStore.closeDialog('zipDownloading');
  };

  useEffect(() => {
    messageStore.setGotoReplyOriginTargetId(-1);
    messageStore.setReplyMessageId(-1);
    messageStore.setParentMessageId(-1);
    messageStore.setNewIncomingMessage(null);
    setShowToReplyButton(false);
    setIsFirstRender(true);
    uiStore.setEmoticonModalVisible(false);
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
      setShowButton(false);
      setShowNewMsgButton(true);
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
    <S.Wrapper>
      <Notice />
      <LinksDialog />
      <VoteDialog />
      <ReserveDialog />
      <NoticeDialog />
      <ReactionDialog />
      <DeliverDialog />
      <UnreadUserDialog />
      <MemberInviteDialog />
      <MessageContextMenu />
      <DeliverContextMenu />
      <CalendarContextMenu />
      <ConfirmDialog
        open={uiStore.deletedVote}
        title={'삭제된 투표입니다.'}
        description={'투표가 삭제되어 결과를 확인할 수 없습니다.'}
        onClose={handleCloseDeletedVote}
        onClickOk={handleCloseDeletedVote}
      />
      <ConfirmDialog
        open={uiStore.confirmDeletedNotice}
        title={'삭제된 공지입니다.'}
        onClickOk={handleCloseConfirmDeletedNotice}
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
      <ConfirmDialog
        open={uiStore.openZipDownloading}
        htmlElement={<Icon.LoadingMotion width={36} height={36} />}
        content={uiStore.zipDownloadSize}
        okText="저장 취소"
        onClickOk={handleCancelZipDownload}
      />
      <Mui.Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={uiStore.toastOpen}
        onClose={handleCloseToast}
        autoHideDuration={2000}
        message={uiStore.toastString}
        action={
          <div
            onClick={handleCloseToast}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '16px',
            }}
          >
            <Icon.CloseLine width={15} height={15} color={Color.White[100]} />
          </div>
        }
        sx={{
          '& .MuiSnackbarContent-message': {
            padding: '2px 0',
          },
        }}
      />
      {messageStore.isInit ? null : (
        <Virtuoso
          width={'100%'}
          height={'100%'}
          ref={handleVirtuousoRef}
          firstItemIndex={messageStore.firstItemIndex}
          data={allMessages}
          totalCount={allMessages.length}
          initialTopMostItemIndex={{
            align: 'center',
            index: messageStore.getMyLastReadMsgIndex(isFirstRender),
          }}
          startReached={prependUpperItems}
          endReached={prependLowerItems}
          itemContent={handleItemContent}
          atBottomThreshold={10}
          atBottomStateChange={handleAtBottomStateChange}
          followOutput={handleFollowOutput}
          // defaultItemHeight={100}
          itemsRendered={handleItemsRendered}
          isScrolling={handleIsScrolling}
        />
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
            activeColor={Color.Black[10]}
          />
        </S.ScrollDownButton>
      )}
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
      {uiStore.openStickerPreview && (
        <StickerPreview
          emoticonStore={emoticonStore}
          uiStore={uiStore}
          talkStore={talkStore}
        />
      )}
      {uiStore.openMediaPreview && <MediaPreview />}
    </S.Wrapper>
  );
});

export default TalkBody;
