import { useNavigate } from 'react-router-dom';

import {
  MobileRoom as MobileRoomList,
  RoomModel,
  useCoreStore,
} from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import * as S from './styled';

// import { ReactComponent as ReservationMessageIcon } from '@/assets/icons/ReservationMessageIcon.svg';

const RoomList = observer(() => {
  const { roomStore } = useCoreStore();
  const { configStore, messageStore, talkStore, uiStore } = useStore();

  const { appId } = talkStore;

  const navigate = useNavigate();

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
            navigate(`/talk/${room.id}`);
          }

          if (getRoomType(room).isDm) {
            setTimeout(() => {
              roomStore.updateSubText({
                roomId: room.id,
                newSubText: '',
              });
              roomStore.clearLastNotification(room.id);
            }, 0);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    handleRoomClick: async (room: RoomModel) => {
      try {
        if (room?.id) {
          const res = await roomStore.fetchRoomDetail({
            roomId: room.id,
            appId: window.APP_ID,
          });

          if (res) {
            roomStore.setCurrentRoomId(room.id);
            navigate(`/talk/${room.id}`);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    handleOpenReserveListButtonClick: () => {
      console.log('');
      // uiStore.setReserveDialogMode('list');
      // uiStore.openDialog('reserve');
      // reserveStore.setEntryPoint('LNB');
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
  };

  const customButtonListForApp = [
    {
      icon: <Icon.Add2Line width={24} height={24} />,
      onClick: roomListFunctions.handleOpenReserveListButtonClick,
    },
  ];

  const customContextMenuListForApp = {
    appName: configStore.RoomListTitle,
    generateMenuList: (room: RoomModel) => [
      !getRoomType(room).isMyRoom && {
        icon: <Icon.PasswordOnLine width={16} height={16} />,
        name: '읽음 처리',
        onClick: () => contextMenuFunctions.readMessageClick(room),
      },
    ],
  };

  return (
    <S.RoomListWrapper>
      <MobileRoomList
        appId={appId}
        headerOption={{
          title: configStore.RoomListTitle,
          defaultRoomSortFilter: 'RECENT_ALARM',
          roomCreateDialogOption: {
            onCreateRoom: roomListFunctions.handleRoomCreate,
          },
          dropdownFilterOption: {
            showRoomTypeFilter: true,
            roomActivityFilterMenu: [],
          },
          customButtonListForApp: customButtonListForApp,
        }}
        listOption={{
          onClickRoomItem: roomListFunctions.handleRoomClick,
          isOpenProfileOnClickProfileImage: configStore.RoomListShowProfile,
          notificationOption: 'DATE_COUNT',
          customContextMenuListForApp,
        }}
      />
    </S.RoomListWrapper>
  );
});

export default RoomList;
