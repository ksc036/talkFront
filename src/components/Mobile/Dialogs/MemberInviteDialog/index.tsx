import { useLocation, useNavigate } from 'react-router-dom';

import {
  MobileMemberSelectorDialog,
  RoomModel,
  useCoreStore,
} from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

const MemberInviteDialog = observer(() => {
  const { roomStore } = useCoreStore();
  const { talkStore, configStore } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { appId } = talkStore;

  const roomInfo = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const { isDm } = getRoomType(roomInfo);

  const curMemberIdList = roomStore.currentRoomId
    ? roomStore
        .getRoomMemberList(roomStore.currentRoomId)
        .map((member) => member.personaId)
    : [];

  const handleInviteDialogClose = () => {
    navigate(-1);
  };

  const handleInviteMembers = async ({
    selectedPersonaList,
    selectedRoomList,
  }: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    try {
      const res = await roomStore.inviteMember({
        appId: appId,
        roomId: roomStore.currentRoomId as number,
        selectedPersonaIdList: selectedPersonaList,
        selectedRoomIdList: selectedRoomList,
      });

      if (res.result !== 'success') {
        console.log('초대 오류');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCreateRoom = async (selectedList?: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    try {
      const res = await roomStore.createRoom({
        appId: appId,
        roomTypeId: 5,
        selectedPersonaIdList: selectedList?.selectedPersonaList
          ? [...curMemberIdList, ...selectedList?.selectedPersonaList]
          : [...curMemberIdList],
        selectedRoomIdList: selectedList?.selectedRoomList,
      });
      if (res.result === 'created') {
        const room = await roomStore.fetchRoomDetail({
          appId,
          roomId: res.room.id,
        });

        if (room) {
          navigate(`/talk/${room.id}`, { replace: true });
          roomStore.setCurrentRoomId(room.id);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <MobileMemberSelectorDialog
      appId={appId}
      isOpen={pathname.includes('invite')}
      title={'구성원 추가'}
      submitButtonOption={{
        text: '추가',
        onClick: isDm ? handleCreateRoom : handleInviteMembers,
      }}
      disabledIds={{
        room: (roomStore.myRoom?.id
          ? [roomStore.myRoom.id, roomStore.currentRoomId]
          : [roomStore.currentRoomId]) as number[],
        persona: curMemberIdList,
      }}
      onClose={handleInviteDialogClose}
      detailSearchItemKeys={configStore.MemberSelectorSearchKeys}
    />
  );
});

export default MemberInviteDialog;
