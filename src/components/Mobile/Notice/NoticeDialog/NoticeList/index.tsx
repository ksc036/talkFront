import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme, AppBar, AppBarCloseButton } from '@wapl/ui';
import { observer } from 'mobx-react';

import CommonButton from '@/components/Common/Button';
import EmptyList from '@/components/Common/EmptyList';
import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { INFINITE_SCROLL_SIZE } from '@/constants/common';
import { NoticeModel } from '@/models';
import { useStore } from '@/stores';
import { timeStampFormat, parseNewLine } from '@/utils';

import * as S from './styled';

const NoticeList = observer(() => {
  const { roomStore, personaStore } = useCoreStore();
  const { uiStore, noticeStore, voteStore, configStore } = useStore();
  const { Color } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const handleClickDetail = (notice: NoticeModel) => () => {
    if (notice.noticeType.includes('vote')) {
      voteStore
        .getVote({
          voteId: notice.noticeBody.voteId as number,
        })
        .then((vote) => {
          if (!vote?.isDeleted) {
            navigate(`/talk/${roomStore.currentRoomId}/allvote#vote`);
          } else uiStore.openDialog('deletedVote');
        });
    } else {
      noticeStore.setCurrentNoticeId(notice.noticeId);
      navigate(`/talk/${roomStore.currentRoomId}/notice#read`);
    }
  };

  const handleAdd = () => {
    navigate(`/talk/${roomStore.currentRoomId}/notice#create`);
  };

  const handleClickBack = () => {
    navigate(-1);
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
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching notices data:', error);
    }
  };

  const fetchMoreData = () => {
    if (noticeStore.__hasMore) getNoticeList();
  };

  useEffect(() => {
    if (uiStore.openNotice) {
      getNoticeList();
    }
    return () => {
      noticeStore.setNotices([]);
      noticeStore.setLastNoticeId(-1);
    };
  }, [uiStore.openNotice]);

  return (
    <S.Wrapper>
      <S.NoticeHeader>
        <AppBar
          title={'공지'}
          style={{
            boxSizing: 'border-box',
            backgroundColor: Color.Background[0],
          }}
          leftSide={<AppBarCloseButton onClick={handleClickBack} />}
        />
      </S.NoticeHeader>
      <S.NoticeBody>
        {noticeStore.notices.length === 0 ? (
          !isLoading && (
            <S.NoticeEmpty>
              <EmptyList
                icon={false}
                title="공지를 등록해 보세요."
                description="직접 공지를 작성하거나 메시지로 공지를 등록할 수 있습니다."
              />
              <S.ButtonWrapper>
                <CommonButton size="extra-large" onClick={handleAdd}>
                  공지 생성
                </CommonButton>
              </S.ButtonWrapper>
            </S.NoticeEmpty>
          )
        ) : (
          <S.NoticeList id="scrollableDiv">
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
                          (notice.noticeType.includes('vote')
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
                    <div>
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
                      color={Color.Gray[900]}
                    />
                  )}
                </S.NoticeItemWrapper>
              ))}
            </InfiniteScroll>
            <S.AddButton onClick={handleAdd} aria-label="notice-add">
              <Squircle
                size={48}
                icon={
                  <Icon.Add2Line
                    width={24}
                    height={24}
                    color={Color.White[100]}
                  />
                }
                color={configStore.MainColor}
              />
            </S.AddButton>
          </S.NoticeList>
        )}
      </S.NoticeBody>
    </S.Wrapper>
  );
});

export default NoticeList;
