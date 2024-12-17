import React, { useEffect, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { useStore } from '@/stores';
import { getNoticePreseneceState, toggleNoticePreseneceState } from '@/utils';

import * as S from './styled';

const Notice = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNoticeHidden, setIsNoticeHidden] = useState(false);

  const { uiStore, noticeStore, voteStore } = useStore();
  const { roomStore, personaStore } = useCoreStore();
  const theme = useTheme();

  const handleClickExpand = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };
  const handleClickToggle = () => {
    if (!isNoticeHidden) {
      setIsExpanded(false);
    }
    toggleNoticePreseneceState(
      roomStore.currentRoomId as number,
      !isNoticeHidden,
    );
    setIsNoticeHidden((prev) => !prev);
  };
  const handleOpenDialog = () => {
    if (noticeStore.pinnedNotice) {
      if (noticeStore.pinnedNotice.noticeType.includes('vote')) {
        voteStore
          .getVote({
            voteId: noticeStore.pinnedNotice.noticeBody.voteId as number,
          })
          .then((vote) => {
            if (!vote?.isDeleted) {
              uiStore.setVoteDialogMode('noticedVote');
              uiStore.openDialog('vote');
            } else uiStore.openDialog('deletedVote');
          });
      } else {
        noticeStore.setCurrentNoticeId(noticeStore.pinnedNotice.noticeId);
        uiStore.setNoticeDialogMode('read');
        uiStore.openDialog('notice');
      }
    }
  };

  useEffect(() => {
    const noticeState = getNoticePreseneceState(
      roomStore.currentRoomId as number,
    );
    setIsNoticeHidden(noticeState);
    const getPinnedNotice = async () => {
      const roomId = roomStore.currentRoomId as number;
      await noticeStore.getPinnedNotice({ roomId });
    };
    if (roomStore.currentRoomId) {
      getPinnedNotice();
    }
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    const noticeState = getNoticePreseneceState(
      roomStore.currentRoomId as number,
    );
    setIsExpanded(false);
    setIsNoticeHidden(noticeState);
  }, [noticeStore.pinnedNotice]);

  if (!noticeStore.pinnedNotice) {
    return null;
  }

  return (
    <>
      {isNoticeHidden ? (
        <S.NoticeFloatingButton onClick={handleClickToggle}>
          <Icon.NoticeLine
            height={20}
            width={20}
            color={theme.Color.Gray[900]}
          />
          <S.Overlay />
        </S.NoticeFloatingButton>
      ) : (
        <S.Wrapper isExpanded={isExpanded}>
          <S.NoticeContent onClick={handleOpenDialog}>
            {noticeStore.pinnedNotice.noticeType.includes('vote') ? (
              <Icon.VoteLine
                width={20}
                height={20}
                color={theme.Color.Gray[900]}
              />
            ) : (
              <Icon.NoticeLine
                width={20}
                height={20}
                color={theme.Color.Gray[900]}
              />
            )}
            <S.Notice>
              <PlainMessage
                content={
                  (noticeStore.pinnedNotice.noticeType.includes('vote')
                    ? noticeStore.pinnedNotice.noticeBody.voteBody?.title
                    : noticeStore.pinnedNotice?.noticeBody.content) ?? ''
                }
                msgId={noticeStore.pinnedNotice?.noticeId}
                getShort={true}
                shortLines={isExpanded ? 2 : 1}
                getLink={false}
                getMention={false}
                allowKeywordSearch={false}
              />

              {isExpanded && (
                <S.NoticedBy>
                  {personaStore
                    .getPersona(noticeStore.pinnedNotice.personaId)
                    ?.nick.concat(' 등록') ?? ''}
                </S.NoticedBy>
              )}
            </S.Notice>
            <S.ExpandButton onClick={handleClickExpand}>
              {isExpanded ? (
                <Icon.ArrowTopLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[500]}
                />
              ) : (
                <Icon.ArrowBottomLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[500]}
                />
              )}
            </S.ExpandButton>
          </S.NoticeContent>
          {isExpanded && (
            <S.ExpandedContent>
              <S.CollapseButton onClick={handleClickToggle}>
                {'접어두기'}
              </S.CollapseButton>
            </S.ExpandedContent>
          )}
        </S.Wrapper>
      )}
    </>
  );
});

export default Notice;
