import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useCoreStore, RoomModel, RoomMember } from '@wapl/core';
import { Mui, Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType, sortByPersonaName } from '@/utils';

import RoomInfoMenuItem from './RoomMemberList';
import * as S from './style';

interface RoomInfoMenuProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
}
const RoomMemberCountPopover = observer((props: RoomInfoMenuProps) => {
  const { anchorEl, setAnchorEl } = props;
  const [sortedRoomMemberList, setSortedRoomMemberList] = useState<
    RoomMember[]
  >([]);
  const { roomStore, userStore } = useCoreStore();
  const { configStore, uiStore } = useStore();
  const { Color } = useTheme();

  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const roomType = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
  );

  const isInvitationPossible =
    roomType.isPrivate &&
    configStore.RoomMenuItemsType.MemberInvite &&
    roomStore.getRoomById(roomStore.currentRoomId as number)?.myInfo
      ?.isInvitationPossible;

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleInviteDialogOpen = () => {
    uiStore.openDialog('invite');
  };

  const roomMember: RoomMember[] = roomStore.getRoomMemberList(
    roomStore.currentRoomId as number,
  );
  useEffect(() => {
    const roomMemberList = sortByPersonaName(roomMember);
    const myPersona = roomMemberList.find(
      (persona: RoomMember) =>
        persona?.personaId === (userStore.selectedPersona?.id as number),
    ) as RoomMember;
    const adminPersona = roomMemberList.find(
      (persona: RoomMember) => currentRoom.regiPersonaId === persona?.personaId,
    ) as RoomMember;

    if (!adminPersona || myPersona.personaId === adminPersona.personaId)
      setSortedRoomMemberList([
        myPersona,
        ...roomMemberList.filter(
          (persona: RoomMember) =>
            persona?.personaId !== (userStore.selectedPersona?.id as number) &&
            currentRoom.regiPersonaId !== persona?.personaId,
        ),
      ]);
    else
      setSortedRoomMemberList([
        myPersona,
        adminPersona,
        ...roomMemberList.filter(
          (persona: RoomMember) =>
            persona?.personaId !== (userStore.selectedPersona?.id as number) &&
            currentRoom.regiPersonaId !== persona?.personaId,
        ),
      ]);
    // roomPersona 임시로 추가
  }, [roomMember]);

  return (
    <Mui.Popover
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: '260px',
          height: '272px',
          marginTop: '8px',
          overflowY: 'hidden',
          borderRadius: '12px',
          backgroundColor: Color.Background[2],
        },
      }}
    >
      <S.RoomInfoMenuItemWrapper hasInviteButton={isInvitationPossible}>
        {sortedRoomMemberList.map((roomMember: RoomMember) => (
          <RoomInfoMenuItem
            key={roomMember?.personaId}
            roomMember={roomMember}
            myself={roomMember?.personaId === userStore.selectedPersona?.id}
          />
        ))}
      </S.RoomInfoMenuItemWrapper>
      {isInvitationPossible && (
        <S.InviteButton onClick={handleInviteDialogOpen}>
          <Icon.Add2Line width={20} height={20} color="#5558C9" />
          <S.InviteText>대화 상대 초대</S.InviteText>
        </S.InviteButton>
      )}
    </Mui.Popover>
  );
});

export default RoomMemberCountPopover;
