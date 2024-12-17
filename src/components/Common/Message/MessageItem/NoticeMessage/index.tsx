import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { MessageType } from '@/@types';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import MetaTagMessage from '../MetaTagMessage';

interface TextMessageProps {
  msgBody: MessageModel['msgBody'];
  msgId: number;
  msgType: MessageType[];
  isReply?: boolean;
}

const NoticeMessage = observer((props: TextMessageProps) => {
  const { msgBody, msgId, msgType, isReply } = props;
  const { noticeBody } = msgBody;
  let navigate: NavigateFunction | null = null;

  if (isMobile()) {
    navigate = useNavigate();
  }

  const { noticeStore, uiStore, voteStore } = useStore();
  const { roomStore } = useCoreStore();

  const handleClickNoticeMessage = async () => {
    if (isReply) return;
    if (msgType.includes('vote')) {
      voteStore
        .getVote({
          voteId: msgBody.noticeBody?.voteId as number,
        })
        .then((vote) => {
          if (!vote?.isDeleted) {
            if (isMobile() && navigate) {
              navigate(`/talk/${roomStore.currentRoomId}/allvote#vote`);
            } else {
              uiStore.setVoteDialogMode('noticedVote');
              uiStore.openDialog('vote');
            }
          } else uiStore.openDialog('deletedVote');
        });
    } else if (msgBody.noticeId) {
      try {
        const notice = await noticeStore.getNotice({
          noticeId: msgBody.noticeId,
          roomId: roomStore.currentRoomId as number,
        });
        if (!notice || !notice?.noticeId) {
          uiStore.openDialog('confirmDeletedNotice');
        } else if (!notice?.isDeleted) {
          noticeStore.setCurrentNoticeId(msgBody.noticeId);
          if (isMobile() && navigate) {
            navigate(`/talk/${roomStore.currentRoomId}/notice#read`);
          } else {
            uiStore.setNoticeDialogMode('read');
            uiStore.openDialog('notice');
          }
        }
      } catch (e) {
        uiStore.openDialog('confirmDeletedNotice');
      }
    }
  };

  const content =
    (msgType.includes('vote')
      ? noticeBody?.voteBody?.title
      : noticeBody?.content) ?? '';

  return (
    <MetaTagMessage
      notiText={'공지가 등록되었습니다.'}
      onClick={handleClickNoticeMessage}
      isReply={isReply}
      title={content}
      titleLimit={3}
      msgId={msgId}
      hasBottom={true}
      bottomText={'글 확인하기'}
      bottomIcon={<Icon.NoticeLine width={16} height={16} />}
    />
  );
});

export default NoticeMessage;
