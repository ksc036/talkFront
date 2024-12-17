import React, { forwardRef, Suspense, useEffect } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, Mui, useTheme } from '@wapl/ui';
import axios, { CancelTokenSource } from 'axios';
import { observer, Observer, useObserver } from 'mobx-react';

import { TalkComponentProps } from '@/@types';
import { RoomInfo } from '@/@types/DTO';
import { MESSAGE_SIZE } from '@/constants';
import useFocusInOut from '@/hooks/useFocusInOut';
import { useMomentInit } from '@/hooks/useMomentInit';
import useSubApp from '@/hooks/useSubApp';
import { useStore } from '@/stores';
import { TopPropsProvider } from '@/TopPropsProvider';
import { getRoomType, unescapeHtml } from '@/utils';

import Loading from '../../Common/Loading';
import Content from '../Content';
import Home from '../Content/Home';
import Header from '../Header';

import * as S from './style';

// const Header = lazy(() => import('../Header'));

const Talk = observer(
  forwardRef(
    (props: TalkComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
      const {
        width,
        height,
        roomMenuItems,
        roomFooterMenuItems,
        windowButton,
        onFileChipClick,
        docsUploadCallback,
        appId,
        headerVisible = true,
      } = props;
      const { roomStore, userStore } = useCoreStore();
      const {
        messageStore,
        noticeStore,
        reactionStore,
        talkStore,
        uiStore,
        configStore,
      } = useStore();
      const { closeSubApp } = useSubApp();

      if (appId) talkStore.setAppId(appId);
      configStore.setTheme(useTheme());
      const currentRoomId = useObserver(
        () => roomStore.currentRoomId,
      ) as number;
      const { Color } = useTheme();
      const toastWidth = width ? `${width * 0.5}px` : 'calc(100% - 50vw);';
      const toastHeight = height ? `calc(100% - ${height - 40}px)` : '40px';

      useFocusInOut();

      const handleCloseToast = () => {
        uiStore.closeToast();
      };

      const tryGetMessages = async (source: any) => {
        try {
          const res = await roomStore.getRoomMemberList(
            roomStore.currentRoomId as number,
          );
          messageStore.setUserList(
            res.map((persona) => persona.personaId),
            userStore.selectedPersona?.id ?? -1,
          );

          await messageStore.getUserLastReadMessageIds(source);

          const roomEnterTime = roomStore.getRoomById(
            roomStore.currentRoomId as number,
          )?.myInfo?.joinDate as string;
          await messageStore.getMessages({
            targetId:
              messageStore.targetId !== -1 ? messageStore.targetId : undefined,
            upSize: MESSAGE_SIZE,
            downSize: MESSAGE_SIZE,
            roomEnterTime,
            isFirstLoad: true,
            source,
          });
          messageStore.setSearchKeyword(messageStore.totalSearchKeyword);
          if (messageStore.state === 'done')
            uiStore.setOpenGetMessageFail(false);
        } catch {
          uiStore.setOpenGetMessageFail(true);
        }
      };

      const personaList = roomStore.getRoomMemberList(
        roomStore.currentRoomId as number,
      );

      const updateLastReadMessage = async () => {
        const roomLastReadMsgId =
          messageStore.getRoomMeta(currentRoomId)?.lastMessageId;
        const roomUnreadCount =
          messageStore.roomMetadataMap.get(currentRoomId)?.count;
        if (
          messageStore.state === 'done' &&
          roomLastReadMsgId !== undefined &&
          !!roomUnreadCount
        ) {
          await messageStore.updateLastReadMessageId({
            roomId: currentRoomId,
            msgId: roomLastReadMsgId,
          });
        }
      };

      const watchRoom = async (source: CancelTokenSource) => {
        talkStore.setIsLoading(true);
        await tryGetMessages(source);
        await updateLastReadMessage();
        talkStore.setIsLoading(false);
      };

      useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if ((roomStore.currentRoomId as number) > 0) {
          messageStore.clear();
          noticeStore.clear();
          reactionStore.clear();
          watchRoom(source);

          uiStore.closeDrawers();
          closeSubApp();
        }
        return () => {
          source.cancel('get message cancel, room changed');
        };
      }, [roomStore.currentRoomId, talkStore.retryFlag]);

      useEffect(() => {
        const updateRoomMeta = async () => {
          const roomInfo = roomStore.roomList.map((room: RoomModel) => {
            const useRoomEnter = getRoomType(room).isDm
              ? configStore.DmRoomEnter
              : configStore.RoomEnter;

            return {
              roomId: room.id,
              ...(useRoomEnter && {
                roomEnterTime: room?.myInfo?.joinDate,
              }),
            } as RoomInfo;
          });

          // 이때 roomMeta 처음 다가져온다 -> messageStore.roomMetadataMap 에 저장
          messageStore.roomMetadataMap.forEach((element, roomId) => {
            if (roomStore.roomMap.has(roomId)) {
              roomStore.updateLastNotification({
                roomId: roomId,
                newLastNotification: {
                  date: new Date(element.lastMessageDate),
                  count: element.count,
                },
              });
              roomStore.updateSubText({
                roomId: roomId,
                newSubText: unescapeHtml(element.lastMessage),
              });
            }
          });
          messageStore.fetchLastMessage({ roomInfos: roomInfo });
        };
        if (roomStore.roomList.length > 0) updateRoomMeta();
      }, [roomStore.roomList]);

      useEffect(() => {
        if (personaList?.length === 0 && roomStore.currentRoomId !== 0) {
          roomStore.setCurrentRoomId(0);
        }
      }, [personaList]);

      useMomentInit();

      if (
        configStore.homeType.homeShape === 'home' &&
        uiStore.selectedLNBTab === 'home'
      ) {
        return (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        );
      }

      return (
        <Observer>
          {() =>
            // 룸 나가기 혹은 룸 삭제 시 화이트아웃 이슈 방지
            // 원리는 룸에서 나가거나 삭제 시에 룸 맵에서 사라지므로 get 해와도 undefined가 찍힘.
            // currentRoomId가 myRoom의 id로 변경된 후에 nullish 하지 않은 값을 가져온 후에 해당 if문 통과 가능
            !roomStore.getRoomById(roomStore.currentRoomId as number) ||
            // 룸에 해당하는 persona list set 하기 전에 통과되면 화이트아웃 이슈 발생
            !personaList ? (
              <Loading />
            ) : (
              <S.TalkLayout>
                <TopPropsProvider
                  onFileChipClick={onFileChipClick}
                  docsUploadCallback={docsUploadCallback}
                >
                  <Suspense
                    fallback={
                      <div
                        style={{
                          background: configStore.HeaderColor,
                          height: '72px',
                        }}
                      />
                    }
                  >
                    <Header
                      width={width}
                      roomMenuItems={roomMenuItems}
                      roomFooterMenuItems={roomFooterMenuItems}
                      windowButton={windowButton}
                      headerVisible={headerVisible}
                    />
                  </Suspense>
                  <Content />
                  <Mui.Snackbar
                    open={uiStore.toastOpen}
                    onClose={handleCloseToast}
                    autoHideDuration={4000}
                    message={uiStore.toastString}
                    {...(!width &&
                      !height && {
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'center',
                        },
                      })}
                    action={
                      <div
                        onClick={handleCloseToast}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Icon.CloseLine
                          width={15}
                          height={15}
                          color={Color.White[100]}
                        />
                      </div>
                    }
                    sx={{
                      zIndex: 10000,
                      '& .MuiPaper-root': {
                        backgroundColor: `${configStore.ToastBackgroundColor}`,
                      },
                      ...((width || height) && {
                        position: 'absolute',
                        left: toastWidth,
                        bottom: toastHeight,
                        transform: 'translateX(-50%)',
                        justifyContent: 'center',
                        '@media (min-width: 600px)': {
                          left: toastWidth,
                          bottom: toastHeight,
                        },
                      }),
                    }}
                  />
                </TopPropsProvider>
              </S.TalkLayout>
            )
          }
        </Observer>
      );
    },
  ),
);

export default Talk;
