import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AppStatus, useShell } from '@shell/sdk';
import { useCoreStore, RoomModel } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { RoomInfo } from '@/@types/DTO';
import { useMomentInit } from '@/hooks/useMomentInit';
import useSuperOS from '@/hooks/useSuperOS';
import { rootStore, useStore } from '@/stores';
import { getRoomType } from '@/utils';
import { printTalkInfo } from '@/utils/printTalkInfo';

import ConfirmDialog from '../Dialogs/ConfirmDialog';
import RoomProfileDialog from '../Dialogs/RoomProfileDialog';
import RoomList from '../RoomList';
import MobileTalkComponent from '../TalkComponent/TalkComponent';

const Mobile = observer(() => {
  const coreStore = useCoreStore();
  const { roomStore, userStore } = coreStore;
  const {
    messageStore,
    talkStore,
    configStore,
    openRoomStore,
    uiStore,
    getEditorStore,
    getAttachmentStore,
    fileStore,
  } = useStore();

  if (process.env.NODE_ENV === 'development') {
    window.APP_ID = 'tmax.core-ai.talk';
  }

  const { appId } = talkStore;

  const shell = useShell();
  const { handleMobileCameraUpload } = useSuperOS();

  const navigate = useNavigate();
  const location = useLocation();
  const [profileRoomId, setProfileRoomId] = useState(0);
  const [roomDeleted, setRoomDeleted] = useState(false);

  const clientMessageHandler = (data: any) => {
    // console.log('[CMS] onClientMessage receive : ', data);
  };
  shell.hooks.useClientMessage(clientMessageHandler);

  // const disabled = useObserver(() => {
  //   if (userStore.selectedPersona?.restriction)
  //     return Boolean(
  //       userStore.selectedPersona?.restriction?.restrictedType & 4 ||
  //         userStore.selectedPersona?.restriction?.restrictedType & 8,
  //     );
  //   return false;
  // });

  useMomentInit();

  // const handleRoomCreate = (res?: RoomModel) => {
  //   if (res?.id) {
  //     roomStore.setCurrentRoomId(res.id);
  //     navigate(`/talk/${res.id}`);
  //   }
  // };

  // const handleCloseCreateRoom = () => {
  //   // if (isRoomCreateComplete) {
  //   //   navigate(-1);
  //   // }
  //   // setIsRoomCreateComplete(false);
  //   uiStore.closeDialog('openRoomCreate');
  // };

  const clearStore = (roomId: number) => {
    const editorStore = getEditorStore(roomId);
    const attachmentStore = getAttachmentStore(roomId);
    editorStore.clear();
    attachmentStore.removeAttachmentsAll();
    messageStore.clearUploadMessageInfo(roomId);
    messageStore.deleteRoomMeta(roomId);
    messageStore.lastReadMessageIdMap.delete(roomId);
  };

  useEffect(() => {
    rootStore.addCoreStore(coreStore);
    handleMobileCameraUpload();
  }, []);

  useEffect(() => {
    shell.mobile.backButton.onBackButton(() => {
      if (uiStore.openMediaPreview) {
        if (uiStore.openMediaShare) {
          uiStore.setOpenMediaShare(false);
        } else {
          uiStore.setOpenMediaPreview(false);
          fileStore.setMediaPreviewMeta(null);
          URL.revokeObjectURL(fileStore.mediaPreviewData?.source ?? '');
        }
        return false;
      } else if (profileRoomId > 0) {
        setProfileRoomId(0);
        return false;
      } else {
        if (location.pathname === '/talk') {
          return true;
        } else {
          navigate(-1);
          return false;
        }
      }
    });

    window.addEventListener('message', async ({ data }) => {
      if (data.type === 'topping:onDestory') {
        window.parent.postMessage({ type: 'topping:done', appId: appId }, '*');
      } else if (data.type === 'topping:onUnreadNotiChange') {
        // notiStore.setUnreadCount(data?.args?.unreadCount ?? 0);
      }

      // 방에서 나가지면 store 정보들 삭제
      if (data.type === 'room:member-out') {
        const { roomId, personaId } = data?.message?.jsonMessage;
        if (userStore.selectedPersona?.id === personaId) {
          clearStore(roomId);
        }
      }
    });

    window.parent.postMessage({ type: 'topping:ready', appId: appId }, '*');

    printTalkInfo();
  }, []);

  useEffect(() => {
    // 룸 리스트로 화면으로 돌아왔을때 room-out 처리
    if (location.pathname === '/talk') {
      roomStore.setCurrentRoomId(0);
      shell.mobile.mobileUi.showGnb();
    } else {
      shell.mobile.mobileUi.hideGnb();
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const updateRoomMeta = async () => {
      const roomInfo = roomStore.roomList.map((room) => {
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
      if (roomInfo.length > 0)
        messageStore.fetchLastMessage({ roomInfos: roomInfo });
    };
    if (roomStore.roomList.length > 0) updateRoomMeta();
  }, [roomStore.roomList]);

  useEffect(() => {
    if (openRoomStore.roomDeleted) {
      setRoomDeleted(true);
      roomStore.setCurrentRoomId(0);
      navigate(`/openRoom`, { replace: true });
      openRoomStore.setRoomDeleted(false);
    }
  }, [openRoomStore.roomDeleted]);

  useEffect(() => {
    document.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false },
    );
    const fetchRoomType = async () => {
      const roomTypeList = await roomStore.fetchRoomTypeList({
        appId: appId,
      });
      talkStore.setRoomTypeList(
        roomTypeList.map((roomType) => roomType.roomTypeName),
      );
    };
    fetchRoomType();
  }, []);

  useEffect(() => {
    const runAppHandler = async (status: [AppStatus, AppStatus], args: any) => {
      try {
        if (args?.roomId > 0) {
          // SAS 작업 필요
          const roomList = await roomStore.fetchRoomList({
            appId: appId,
          });
          // 삭제된 룸인지 확인
          if (
            roomList?.some(
              (room: RoomModel) => room.id === Number(args?.roomId),
            )
          ) {
            await roomStore.fetchRoomDetail({
              roomId: Number(args?.roomId),
              appId: window.APP_ID,
            });
            if (args?.msgId) {
              // 10일 전 삭제된 메시지인지 확인
              if (configStore.RoomEnter) {
                uiStore.setEnterMessageFail(true);
              } else {
                messageStore.setTargetId(Number(args.msgId));
                roomStore.setCurrentRoomId(Number(args.roomId));
                navigate(`/talk/${args.roomId}`);
              }
            } else {
              roomStore.setCurrentRoomId(Number(args.roomId));
              navigate(`/talk/${args.roomId}`);
            }
          } else {
            uiStore.setEnterRoomFail(true);
          }
        }
        if (args?.openCreateRoomDialog) {
          // navigate('#room-create');
          let disabled = false;
          if (userStore.selectedPersona?.restriction)
            disabled = Boolean(
              userStore.selectedPersona?.restriction?.restrictedType & 4 ||
                userStore.selectedPersona?.restriction?.restrictedType & 8,
            );

          if (!disabled) uiStore.openDialog('openRoomCreate');
        }
        if (args?.roomProfileId) {
          const res = await roomStore.fetchRoomDetail({
            roomId: args?.roomProfileId,
            appId: window.APP_ID,
          });
          if (res) {
            setProfileRoomId(res.id);
            window.parent.postMessage(
              { type: 'shell:setLayout', showNavigationBar: false },
              '*',
            );
          }
        }
        if (args?.roomLink) {
          const res = await roomStore.fetchRoomDetailByLink({
            roomLink: args?.roomLink as string,
          });
          if (res.room) {
            const roomId = res.room.id;
            const room = await roomStore.fetchRoomDetail({
              roomId: roomId,
              appId: window.APP_ID,
            });
            if (room.myInfo) {
              // 이미 입장한 오픈룸이면 해당 룸으로 이동
              roomStore.setCurrentRoomId(roomId);
              navigate(`/talk/${roomId}`);
            } else if (
              room.isEntryRequestApprovable === false &&
              room.isLock === false
            ) {
              // 입장 조건이 없는 오픈룸이라면 바로 입장
              await roomStore.enterRoom({ appId: appId, roomId: roomId });
              roomStore.setCurrentRoomId(roomId);
              navigate(`/talk/${roomId}`);
            } else {
              setProfileRoomId(roomId);
              window.parent.postMessage(
                { type: 'shell:setLayout', showNavigationBar: false },
                '*',
              );
            }
          }
        }
        if (args?.route) {
          if (args?.route === 'home') {
            roomStore.setCurrentRoomId(0);
            navigate('/talk/openRoom');
            openRoomStore.setCurTabIndex(1);
          }
        }
        if (args?.openMyRoom) {
          const myRoomId = userStore.selectedPersona?.myRoomId;
          if (myRoomId) {
            await roomStore.fetchRoomDetail({
              roomId: myRoomId,
              appId: window.APP_ID,
            });
            roomStore.setCurrentRoomId(myRoomId);
            navigate(`talk/${myRoomId}`, { replace: true });
          }
        }
        if (window.location.pathname === '/talk') {
          roomStore.setCurrentRoomId(0);
          shell.mobile.mobileUi.showGnb();
        } else {
          shell.mobile.mobileUi.hideGnb();
        }
      } catch (e) {
        console.log('토크앱 룸이동 오류');
      }
    };

    const suspendAppHandler = async (
      status: [AppStatus, AppStatus],
      args: any,
    ) => {
      try {
      } catch (err) {
        console.error('Talk onStop ERROR');
        throw err;
      }
    };

    const destroyAppHandler = async (
      status: [AppStatus, AppStatus],
      args: any,
    ) => {
      try {
        window.parent.postMessage(
          { type: 'topping:done', appId: window.APP_ID },
          '*',
        );
      } catch (err) {
        console.error('Talk onDestroy ERROR');
        throw err;
      }
    };

    shell.addHandler(AppStatus.Running, runAppHandler);
    shell.addHandler(AppStatus.Suspended, suspendAppHandler);
    shell.addHandler(AppStatus.Destroying, destroyAppHandler);
    shell.readyApp();

    return () => {
      shell.removeHandler(AppStatus.Running, runAppHandler);
      shell.removeHandler(AppStatus.Suspended, suspendAppHandler);
      shell.removeHandler(AppStatus.Destroying, destroyAppHandler);
    };
  }, []);

  return (
    <>
      <ConfirmDialog
        open={roomDeleted}
        onClickOk={() => setRoomDeleted(false)}
        title={'입장 불가능한 방입니다.'}
      />
      <RoomProfileDialog
        open={profileRoomId > 0}
        roomId={profileRoomId}
        onClose={() => setProfileRoomId(0)}
      />
      <Routes>
        <Route path="/talk/*">
          <Route
            path=""
            element={
              <>
                <RoomList />
                <ConfirmDialog
                  open={uiStore.enterRoomFail}
                  title={`퇴장했거나 삭제된 ${configStore.FeatureNameType.Room}입니다.`}
                  // content="방진입실패"
                  onClickOk={() => uiStore.setEnterRoomFail(false)}
                />
                <ConfirmDialog
                  open={uiStore.enterMessageFail}
                  title="삭제된 메시지입니다."
                  onClickOk={() => uiStore.setEnterMessageFail(false)}
                />
              </>
            }
          />
          <Route path=":id/*">
            {/* TODO: 아래 컴포넌트들 룸 리스트 가지고 있지 않은 경우 룸 리스트로 보내는 로직 필요 */}
            <Route path="" element={<MobileTalkComponent />} />
            <Route path="notice" element={<MobileTalkComponent />} />
            <Route path="docs" element={<MobileTalkComponent />} />
            <Route path="unreadUser" element={<MobileTalkComponent />} />
            <Route path="links" element={<MobileTalkComponent />} />
            <Route path="drawer" element={<MobileTalkComponent />} />
            <Route path="drawer/settings" element={<MobileTalkComponent />} />
            <Route path="search" element={<MobileTalkComponent />} />
            <Route path="allvote" element={<MobileTalkComponent />} />
            <Route path="bottomItems" element={<MobileTalkComponent />} />
            <Route path="invite" element={<MobileTalkComponent />} />
            <Route path="reserve" element={<MobileTalkComponent />} />
            <Route path="*" element={<Navigate to="/talk" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/talk" replace />} />
      </Routes>
    </>
  );
});

export default Mobile;
