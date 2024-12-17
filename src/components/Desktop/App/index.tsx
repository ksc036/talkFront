import { useEffect, useState } from 'react';

import { AppStatus, useShell } from '@shell/sdk';
import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import TalkComponent from '@/components/Desktop/TalkComponent';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import RoomProfileDialog from '../Dialogs/RoomProfileDialog';
import RoomList from '../RoomList';
import Talk from '../Talk';

import * as S from './styled';

export type LNBTabType = 'search' | 'home' | 'room';

const Desktop = observer(() => {
  const { roomStore, userStore } = useCoreStore();
  const {
    uiStore,
    configStore,
    talkStore,
    openRoomStore,
    getEditorStore,
    getAttachmentStore,
    messageStore,
    fileStore,
  } = useStore();

  if (process.env.NODE_ENV === 'development') {
    window.APP_ID = 'tmax.core-ai.talk';
  }

  const { appId } = talkStore;

  const shell = useShell();
  const docsStore = useDocsStore();

  const [openRoomId, setOpenRoomId] = useState<number | null>(null);

  const clientMessageHandler = (data: any) => {
    // console.log('[CMS] onClientMessage receive : ', data);
  };
  shell.hooks.useClientMessage(clientMessageHandler);

  const handleCancelZipDownload = () => {
    uiStore.closeDialog('zipDownloading');
  };

  const clearStore = (roomId: number) => {
    const editorStore = getEditorStore(roomId);
    const attachmentStore = getAttachmentStore(roomId);
    editorStore.clear();
    attachmentStore.removeAttachmentsAll();
    messageStore.clearUploadMessageInfo(roomId);
    messageStore.deleteRoomMeta(roomId);
    messageStore.lastReadMessageIdMap.delete(roomId);
    fileStore.clearCache();
  };

  useEffect(() => {
    window.addEventListener('message', async ({ data }) => {
      if (
        data.type === 'room:room-delete' &&
        !data?.message?.jsonMessage?.isSubRoom
      ) {
        const roomIdList = data?.message?.roomIdList;
        const count = messageStore.getUnReadAllExcept({ excepts: roomIdList });
        shell.showBadge({ count });
      }
      if (data.type === 'room:member-out') {
        const { roomId, personaId } = data?.message?.jsonMessage;
        if (userStore.selectedPersona?.id === personaId) {
          const count = messageStore.getUnReadAllExcept({ excepts: [roomId] });
          shell.showBadge({ count });
          clearStore(roomId);
        }
      }
      if (data.type === 'room:member-in') {
        const invitedRoomIds = data?.message?.roomIdList?.map(Number);

        invitedRoomIds?.forEach(async (invitedRoomId: number) => {
          await roomStore.fetchRoomDetail({
            appId: 'tmax.core-ai.personal-talk',
            roomId: invitedRoomId,
          });
          const roomInfo = roomStore.getRoomById(invitedRoomId);

          const { isPrivate } = getRoomType(roomInfo as RoomModel);

          if (isPrivate && roomStore.currentRoomId !== invitedRoomId) {
            setTimeout(() => {
              roomStore.updateSubText({
                roomId: invitedRoomId,
                newSubText: '',
              });
              roomStore.clearLastNotification(invitedRoomId);
            }, 0);
          }
        });
      }
    });

    if (!window.opener) {
      window.parent.postMessage(
        {
          type: 'topping:ready',
          appId: appId,
        },
        '*',
      );
    } else {
      window.opener?.postMessage(
        {
          type: 'topping:ready',
          appId: appId,
          roomId: Number(
            window.location.search
              ?.split('&')
              ?.filter((item) => item.includes('roomId'))?.[0]
              ?.split('=')?.[1],
          ),
        },
        '*',
      );
    }

    const fetchRoomType = async () => {
      const roomTypeList = await roomStore.fetchRoomTypeList({
        appId: window.APP_ID,
      });
      talkStore.setRoomTypeList(
        roomTypeList.map((roomType) => roomType.roomTypeName),
      );
    };
    fetchRoomType();

    docsStore.initialize(Number(window.APP_ID) ? Number(window.APP_ID) : 1);
  }, []);

  useEffect(() => {
    const roomSwitch = async () => {
      if (
        (!uiStore.alarmNavigate || uiStore.enterRoomFail) &&
        (roomStore.currentRoomId === 0 ||
          roomStore.currentRoomId === -1 ||
          !roomStore.currentRoomId) &&
        configStore.homeType.homeShape === 'my' &&
        roomStore.myRoom?.id
      ) {
        await roomStore.fetchRoomDetail({
          roomId: roomStore.myRoom?.id as number,
          appId: window.APP_ID,
        });
        roomStore.setCurrentRoomId(roomStore.myRoom?.id as number);
      }
    };
    roomSwitch();
  }, [
    uiStore.alarmNavigate,
    uiStore.enterRoomFail,
    roomStore.roomList,
    roomStore.myRoom,
    roomStore.currentRoomId,
  ]);

  useEffect(() => {
    if (roomStore.currentRoomId === 0) {
      uiStore.setSelectedLNBTab('home');
    } else if (roomStore.currentRoomId === -1) {
      uiStore.setSelectedLNBTab('search');
    }
    fileStore.clearCache();
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    setTimeout(() => {
      if (
        uiStore.alarmNavigate &&
        roomStore.roomList.length > 0 &&
        roomStore.currentRoomId !== 0 &&
        roomStore.currentRoomId !== -1
      ) {
        uiStore.setAlarmNavigate(false);
        if (!roomStore.getRoomById(roomStore.currentRoomId as number)) {
          uiStore.setEnterRoomFail(true);
          if (configStore.homeType.homeShape === 'home') {
            roomStore.setCurrentRoomId(0);
          } else roomStore.setCurrentRoomId(roomStore.myRoom?.id as number);
        }
      }
    }, 0);
  }, [uiStore.alarmNavigate, roomStore.roomList, roomStore.currentRoomId]);

  useEffect(() => {
    const runAppHandler = async (status: [AppStatus, AppStatus], args: any) => {
      try {
        if (args?.isMini) talkStore.setIsMini(args.isMini);
        if (args?.roomId) {
          uiStore.setAlarmNavigate(true);
          const roomList = await roomStore.fetchRoomList({
            appId: window.APP_ID,
          });
          if (
            roomList?.some((room: RoomModel) => room.id === Number(args.roomId))
          ) {
            await roomStore.fetchRoomDetail({
              roomId: args.roomId,
              appId: window.APP_ID,
            });
            if (args?.msgId) {
              // 10일 전 삭제된 메시지인지 확인
              if (configStore.RoomEnter) {
                uiStore.setEnterMessageFail(true);
              } else {
                messageStore.setTargetId(Number(args.msgId));
                roomStore.setCurrentRoomId(Number(args.roomId));
                uiStore.setSelectedLNBTab('room');
              }
            } else {
              roomStore.setCurrentRoomId(Number(args.roomId));
              uiStore.setSelectedLNBTab('room');
            }
          } else {
            roomStore.setCurrentRoomId(0);
            uiStore.setEnterRoomFail(true);
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
            uiStore.setSelectedLNBTab('room');
            uiStore.setAlarmNavigate(true);
            uiStore.closeDialog('openRoomCreate');
            uiStore.setOpenRoomSearchDialog(false);
          }
        }
        if (args?.openCreateRoomDialog) {
          let disabled = false;
          if (userStore.selectedPersona?.restriction)
            disabled = Boolean(
              userStore.selectedPersona?.restriction?.restrictedType & 4 ||
                userStore.selectedPersona?.restriction?.restrictedType & 8,
            );

          if (!disabled) {
            uiStore.openDialog('openRoomCreate');
            uiStore.setOpenRoomSearchDialog(false);
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
              uiStore.setSelectedLNBTab('room');
              roomStore.setCurrentRoomId(roomId);
            } else if (
              room.isEntryRequestApprovable === false &&
              room.isLock === false
            ) {
              // 입장 조건이 없는 오픈룸이라면 바로 입장
              await roomStore.enterRoom({ appId: appId, roomId: roomId });
              uiStore.setSelectedLNBTab('room');
              roomStore.setCurrentRoomId(roomId);
            } else {
              setOpenRoomId(roomId);
            }
          }
        }
        if (args?.route) {
          if (args.route === 'home') {
            roomStore.setCurrentRoomId(-1);
            openRoomStore.setCurTabIndex(0);
          }
        }
      } catch (err) {
        console.error('Talk onStart ERROR');
        throw err;
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

  // 문자열 'true'로 들어옴
  if (talkStore.isMini) {
    return <Talk />;
  }

  return (
    <>
      <S.Wrapper>
        <S.RoomList>
          <RoomList />
        </S.RoomList>
        <TalkComponent />
      </S.Wrapper>
      {uiStore.enterRoomFail && (
        <ConfirmDialog
          open={uiStore.enterRoomFail}
          title={`퇴장했거나 삭제된 ${configStore.FeatureNameType.Room}입니다.`}
          // content="방진입실패"
          onClickOk={() => uiStore.setEnterRoomFail(false)}
        />
      )}
      {uiStore.enterMessageFail && (
        <ConfirmDialog
          open={uiStore.enterMessageFail}
          title="삭제된 메시지입니다."
          onClickOk={() => uiStore.setEnterMessageFail(false)}
        />
      )}
      <RoomProfileDialog roomId={openRoomId} setRoomId={setOpenRoomId} />
      {uiStore.openZipDownloading && (
        <ConfirmDialog
          open={uiStore.openZipDownloading}
          htmlElement={<Icon.LoadingMotion width={36} height={36} />}
          content={uiStore.zipDownloadSize}
          okText="저장 취소"
          onClickOk={handleCancelZipDownload}
        />
      )}

      <ConfirmDialog
        open={uiStore.roomKickedout}
        onClickOk={() => uiStore.setRoomKickedout(false)}
        title={'입장 불가능한 방입니다.'}
      />
    </>
  );
});

export default Desktop;
