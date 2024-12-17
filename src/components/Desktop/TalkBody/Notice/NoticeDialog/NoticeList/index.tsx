import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useCoreStore } from '@wapl/core';
import { Avatar, Icon, useTheme, Tooltip } from '@wapl/ui';
import { observer } from 'mobx-react';

import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import EmptyList from '@/components/Common/EmptyList';
import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { INFINITE_SCROLL_SIZE } from '@/constants/common';
import { NoticeModel } from '@/models';
import { useStore } from '@/stores';
import { timeStampFormat, parseNewLine } from '@/utils';

import * as S from './styled';
interface NoticeListProps {
  onClose: () => void;
}

const NoticeList = observer((props: NoticeListProps) => {
  const { onClose } = props;
  const { uiStore, noticeStore, voteStore, configStore } = useStore();
  const { roomStore, personaStore } = useCoreStore();
  const { Color } = useTheme();

  const [isOverflowed, setIsOverflowed] = useState(false);

  const checkOverflow = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    setIsOverflowed(target.scrollWidth > target.clientWidth);
  };

  const roomName =
    roomStore.getRoomById(roomStore.currentRoomId as number)?.name ?? '';

  const displayAvatarImages =
    roomStore.getRoomById(roomStore.currentRoomId as number)
      ?.profileImageSource ?? '';

  const handleClickDetail = (notice: NoticeModel) => () => {
    if (notice.noticeType.includes('vote')) {
      voteStore
        .getVote({ voteId: notice.noticeBody.voteId as number })
        .then((vote) => {
          if (!vote?.isDeleted) {
            uiStore.setVoteDialogMode('noticedVote');
            uiStore.closeDialog('notice');
            uiStore.openDialog('vote');
          } else uiStore.openDialog('deletedVote');
        });
    } else {
      noticeStore.setCurrentNoticeId(notice.noticeId);
      uiStore.setNoticeDialogMode('read');
    }
  };

  const getNoticeList = async () => {
    try {
      const res = await noticeStore.getNoticesWithLimit({
        roomId: roomStore.currentRoomId as number,
        lastNoticeId:
          noticeStore.lastNoticeId > 0 ? noticeStore.lastNoticeId : null,
        size: INFINITE_SCROLL_SIZE,
      });
      if (!res) {
        console.error('No response from getNoticesWithLimit');
      }
    } catch (error) {
      console.error('Error fetching notice data:', error);
    }
  };

  const getNoticeCount = async () => {
    try {
      const res = await noticeStore.getTotalNoticeCount({
        roomId: roomStore.currentRoomId as number,
      });
      if (!res) {
        console.error('No response from getTotalNoticeCount');
      }
    } catch (error) {
      console.error('Error fetching notice total count:', error);
    }
  };

  const fetchMoreData = () => {
    if (noticeStore.__hasMore) {
      getNoticeList();
      getNoticeCount();
    }
  };

  useEffect(() => {
    if (uiStore.openNotice) {
      getNoticeList();
      getNoticeCount();
    }
    return () => {
      noticeStore.setNotices([]);
      noticeStore.setLastNoticeId(-1);
      noticeStore.setTotalCount(0);
    };
  }, [uiStore.openNotice]);

  return (
    <>
      <CommonDialogHeader iconType="notice" title="공지" onClose={onClose} />
      <S.Content>
        <S.NoticeListHeader>
          <Avatar size={40} imgSrc={displayAvatarImages} />
          <Tooltip
            title={isOverflowed ? roomName : ''}
            placement="bottom-start"
          >
            <S.HeaderText onMouseEnter={checkOverflow}>
              {roomStore.getRoomById(roomStore.currentRoomId as number)?.name}
            </S.HeaderText>
          </Tooltip>
        </S.NoticeListHeader>
        <S.NoticeCountWrapper>
          <S.NoticeCountText>전체</S.NoticeCountText>
          <S.NoticeCountNumber>{noticeStore.totalCount}</S.NoticeCountNumber>
        </S.NoticeCountWrapper>
        <S.NoticeList id="scrollableDiv">
          {noticeStore.notices.length > 0 ? (
            <InfiniteScroll
              dataLength={noticeStore.notices.length}
              next={fetchMoreData}
              hasMore={noticeStore.__hasMore}
              loader={<></>}
              scrollableTarget="scrollableDiv"
            >
              {noticeStore.notices.map((notice) => (
                <S.NoticeItemWrapper
                  key={notice.noticeId}
                  onClick={handleClickDetail(notice)}
                >
                  <S.NoticeItem>
                    <S.ContentText>
                      <PlainMessage
                        msgId={notice.noticeId}
                        content={
                          (notice.noticeBody.voteBody
                            ? notice.noticeBody.voteBody?.title
                            : parseNewLine(
                                notice.noticeBody.content as string,
                              )) ?? ''
                        }
                        getLink={false}
                        getMention={false}
                        allowKeywordSearch={false}
                      />
                    </S.ContentText>
                    <div style={{ display: 'flex' }}>
                      <S.NameText>
                        {personaStore.getPersona(notice.personaId)?.nick ?? ''}
                      </S.NameText>
                      <S.TimeText>{`${timeStampFormat(
                        notice.updatedAt,
                        'MM월 DD일 a HH:mm',
                      )} 공지`}</S.TimeText>
                    </div>
                  </S.NoticeItem>
                  {notice.noticeType.includes('vote') && (
                    <Icon.VoteLine
                      width={20}
                      height={20}
                      color={configStore.MainColor ?? Color.Gray[900]}
                    />
                  )}
                </S.NoticeItemWrapper>
              ))}
            </InfiniteScroll>
          ) : (
            <EmptyList
              title="공지를 등록해 보세요."
              description="직접 공지를 작성하거나 메시지로 공지를 등록할 수 있습니다."
            />
          )}
        </S.NoticeList>
      </S.Content>
    </>
  );
});

export default NoticeList;
