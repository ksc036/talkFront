import { useEffect, useState } from 'react';

import { useShell } from '@shell/sdk';
import {
  DesktopRoom as DesktopRoomList,
  RoomModel,
  useCoreStore,
  DesktopRoomSearchDialog,
  DesktopRoomSeoulEdu as DesktopRoomListSen,
  DesktopRoomCreateDialog,
} from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ReactComponent as ChatSearchLine } from '@/assets/icons/ChatSearchLine.svg';
import { ReactComponent as ReservationMessageIcon } from '@/assets/icons/ReservationMessageIcon.svg';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import * as S from './styled';

const RoomList = observer(() => {
  const { roomStore } = useCoreStore();
  const { configStore, uiStore, messageStore, talkStore, reserveStore } =
    useStore();

  const { appId } = talkStore;
  const shell = useShell();

  const [previousRoomIds, setPreviousRoomIds] = useState<number[]>();

  useEffect(() => {
    setPreviousRoomIds([...roomStore.roomList.map((room) => room.id)]);
  }, [roomStore.roomList]);

  const roomListFunctions = {
    handleRoomCreate: async (room?: RoomModel) => {
      try {
        if (room?.id) {
          const res = await roomStore.fetchRoomDetail({
            roomId: room.id,
            appId: window.APP_ID,
          });

          if (res) {
            roomStore.setCurrentRoomId(room.id);
            uiStore.setSelectedLNBTab('room');

            if (getRoomType(room).isDm && !previousRoomIds?.includes(room.id)) {
              setTimeout(() => {
                roomStore.updateSubText({
                  roomId: room.id,
                  newSubText: '',
                });
                roomStore.clearLastNotification(room.id);
                setPreviousRoomIds([
                  ...roomStore.roomList.map((room) => room.id),
                ]);
              }, 0);
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },

    handleRoomClick: async (room?: RoomModel) => {
      try {
        if (room?.id) {
          const res = await roomStore.fetchRoomDetail({
            roomId: room.id,
            appId: window.APP_ID,
          });

          if (res) {
            roomStore.setCurrentRoomId(room.id);
            uiStore.setSelectedLNBTab('room');
          }
        }
      } catch (error) {
        throw error;
      }
    },

    handleCreateRoomButtonClick: () => {
      uiStore.openDialog('openRoomCreate');
    },

    handleSearchOpenRoomButtonClick: () => {
      uiStore.setOpenRoomSearchDialog(true);
    },

    handleOpenReserveListButtonClick: () => {
      uiStore.setReserveDialogMode('list');
      uiStore.openDialog('reserve');
      reserveStore.setEntryPoint('LNB');
    },
  };

  const roomSearchDialogFunctions = {
    handleRoomEnter: async (room: RoomModel) => {
      uiStore.setOpenRoomSearchDialog(false);

      try {
        if (room?.id) {
          await roomStore.fetchRoomDetail({
            roomId: room.id,
            appId: window.APP_ID,
          });
          roomStore.setCurrentRoomId(room.id);
          uiStore.setSelectedLNBTab('room');
        }
      } catch (error) {
        throw error;
      }
    },

    handleRoomSearchDialogClose: () => {
      uiStore.setOpenRoomSearchDialog(false);
    },
  };

  const contextMenuFunctions = {
    readMessageClick: (room: RoomModel) => {
      const roomLastReadMsgId = messageStore.getRoomMeta(
        room.id,
      )?.lastMessageId;
      const roomUnreadCount = messageStore.roomMetadataMap.get(room.id)?.count;
      if (roomLastReadMsgId != undefined && !!roomUnreadCount) {
        roomStore.clearLastNotification(room.id);
        messageStore.updateLastReadMessageId({
          roomId: room.id,
          msgId: roomLastReadMsgId,
        });
      }
    },

    alarmClick: (room: RoomModel) => {
      // 알림 켜기/끄기 기능
    },

    miniChatClick: (room: RoomModel) => {
      shell.runApp({
        appId: String(appId),
        args: {
          isMini: true,
          roomId: room.id,
        },
        options: {
          isWindow: true,
          width: 480,
          height: 680,
        },
      });
    },
  };

  const handleCreateRoomDialogClose = () => {
    uiStore.closeDialog('openRoomCreate');
  };

  const getRoomSearchButtonIcon = () => {
    if (typeof configStore.RoomListRoomSearchButtonIcon === 'string') {
      return (
        <S.RoomListHeaderIcon src={configStore.RoomListRoomSearchButtonIcon} />
      );
    } else if (typeof configStore.RoomListRoomSearchButtonIcon === 'object') {
      const ButtonIcon = configStore.RoomListRoomSearchButtonIcon;
      return <ButtonIcon width={24} height={24} />;
    } else {
      return <Icon.ChatOpenLine width={24} height={24} />;
    }
  };

  const customButtonListForApp = [
    ...(configStore.RoomListShowSearchRoomButton
      ? [
          {
            icon: getRoomSearchButtonIcon(),
            onClick: roomListFunctions.handleSearchOpenRoomButtonClick,
          },
        ]
      : []),
    ...(configStore.RoomListShowCreateRoomButton
      ? [
          {
            icon: <Icon.Add2Line width={24} height={24} />,
            onClick: roomListFunctions.handleCreateRoomButtonClick,
          },
        ]
      : []),
    ...(configStore.FooterMenuItems.Reserve
      ? [
          {
            icon: <ReservationMessageIcon width={24} height={24} />,
            onClick: roomListFunctions.handleOpenReserveListButtonClick,
          },
        ]
      : []),
  ];

  const customContextMenuListForApp = {
    appName: configStore.RoomListTitle,
    generateMenuList: (room: RoomModel) => [
      !getRoomType(room).isMyRoom && {
        icon: <Icon.PasswordOnLine width={16} height={16} />,
        name: '읽음 처리',
        onClick: () => contextMenuFunctions.readMessageClick(room),
      },
      // !getRoomType(room).isMyRoom && {
      //   icon: (room: RoomModel) => ~~~ ? <Icon.AlarmOffLine width={16} height={16} /> : <Icon.AlarmOnLine width={16} height={16} /> ,
      //   name: (room: RoomModel) => ~~~ ? '알림 끄기' : '알림 켜기',
      //   onClick: handleContextMenuAlarmClick,
      // },
      configStore.HeaderMenuItems.MiniChat && {
        icon: <Icon.ChatMiniLine width={16} height={16} />,
        name: configStore.FeatureNameType.MiniChat,
        onClick: () => contextMenuFunctions.miniChatClick(room),
      },
    ],
  };

  const customSelectedCondition = (room?: RoomModel) =>
    room?.id === roomStore.currentRoomId;

  return (
    <>
      <S.RoomListWrapper>
        {window.env.BUSINESS_NAME === 'SEN' ? (
          <S.RoomListSenWrapper>
            <S.RoomListHeaderWrapper>
              <S.RoomListHeaderTitle>
                {configStore.RoomListTitle}
              </S.RoomListHeaderTitle>
              <S.RoomListHeaderButtonList>
                {customButtonListForApp.map((customButton) => (
                  <S.RoomListHeaderButton onClick={customButton.onClick}>
                    {customButton.icon}
                  </S.RoomListHeaderButton>
                ))}
              </S.RoomListHeaderButtonList>
            </S.RoomListHeaderWrapper>

            <DesktopRoomListSen
              appId={appId}
              headerOption={{
                title: configStore.RoomListTitle,
                defaultRoomSortFilter: 'RECENT_ALARM',
                showRoomCreateDialogOpenButton: false,
                roomCreateDialogOption: {
                  onCreateRoom: roomListFunctions.handleRoomCreate,
                },
                customButtonListForApp,
              }}
              listOption={{
                onClickRoomItem: roomListFunctions.handleRoomClick,
                isOpenProfileOnClickProfileImage:
                  configStore.RoomListShowProfile,
                notificationOption: 'DATE_COUNT',
                customContextMenuListForApp,
                customSelectedCondition,
              }}
              initialRoomTypeIdListForApp={
                configStore.RoomListRoomTypeIds.RoomList
              }
              sizeOption={{ width: 320 }}
            />
          </S.RoomListSenWrapper>
        ) : (
          <DesktopRoomList
            appId={appId}
            headerOption={{
              title: configStore.RoomListTitle,
              defaultRoomSortFilter: 'RECENT_ALARM',
              showRoomCreateDialogOpenButton: false,
              roomCreateDialogOption: {
                onCreateRoom: roomListFunctions.handleRoomCreate,
              },
              customButtonListForApp,
              dropdownFilterOption: {
                showRoomTypeFilter: true,
                roomActivityFilterMenu: [],
              },
            }}
            listOption={{
              onClickRoomItem: roomListFunctions.handleRoomClick,
              isOpenProfileOnClickProfileImage: configStore.RoomListShowProfile,
              notificationOption: 'DATE_COUNT',
              customContextMenuListForApp,
              customSelectedCondition,
            }}
            initialRoomTypeIdListForApp={
              configStore.RoomListRoomTypeIds.RoomList
            }
            sizeOption={{ width: 320 }}
          />
        )}
      </S.RoomListWrapper>

      <DesktopRoomCreateDialog
        appId={appId}
        isOpen={uiStore.openRoomCreate}
        onClose={handleCreateRoomDialogClose}
        onCancel={handleCreateRoomDialogClose}
        onComplete={roomListFunctions.handleRoomCreate}
        initialRoomTypeIdListForApp={configStore.RoomListRoomTypeIds.CreateRoom}
        roomAlias={configStore.RoomListRoomAlias}
      />

      <DesktopRoomSearchDialog
        open={uiStore.openRoomSearchDialog}
        onClose={roomSearchDialogFunctions.handleRoomSearchDialogClose}
        onEnter={roomSearchDialogFunctions.handleRoomEnter}
        roomAlias={`오픈 ${configStore.RoomListRoomAlias}`}
      />
    </>
  );
});

export default RoomList;
