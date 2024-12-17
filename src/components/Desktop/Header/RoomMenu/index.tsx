import { useState, MouseEvent, useEffect } from 'react';

import { RoomModel, useCoreStore, RoomMember } from '@wapl/core';
import { Icon, Mui } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType, sortByPersonaName } from '@/utils';
import { RoomMenuFooter } from '@desktop/Header/RoomMenu';
import * as S from '@desktop/Header/RoomMenu/style';

import {
  Files,
  Links,
  Mails,
  Member,
  Notice,
  RoomMenuItems,
  Vote,
} from '../RoomMenuItems';

import { Star } from './RoomMenuFooter';
import { Setting } from './RoomMenuFooter';
import JoinLinkCopy from './RoomMenuFooter/JoinLinkCopy';
import { MemberInvite } from './RoomMenuFooter/MemberInvite';

interface RoomMenuProps {
  roomMenuItem?: React.ReactNode;
  roomMenuItems?: React.ReactNode[];
  roomFooterMenuItems?: React.ReactNode[];
}

const RoomMenu = observer((props: RoomMenuProps) => {
  const {
    roomMenuItems,
    // roomFooterMenuItems,
  } = props;

  const { roomStore, userStore } = useCoreStore();
  const { configStore, uiStore } = useStore();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    uiStore.setRoomMenuAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    uiStore.setRoomMenuAnchorEl(null);
  };

  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;

  const roomType = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
  );

  const isInvitationPossible =
    (roomType.isPrivate ||
      (roomType.isDm && configStore.RoomMenuItemsType.DMMemberInvite)) &&
    configStore.RoomMenuItemsType.MemberInvite &&
    roomStore.getRoomById(roomStore.currentRoomId as number)?.myInfo
      ?.isInvitationPossible;

  const isLinkSharePossible =
    roomType.isOpenRoom && configStore.RoomMenuItemsType.InviteURLCopy;

  const [personaList, setPersonaList] = useState<RoomMember[]>([]);

  const roomPersona = roomStore.getRoomMemberList(
    roomStore.currentRoomId as number,
  );

  useEffect(() => {
    uiStore.setRoomMenuAnchorEl(null);
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    const roomPersonaList = sortByPersonaName(roomPersona);
    const myPersona = roomPersonaList.find(
      (persona: RoomMember) =>
        persona?.personaId === (userStore.selectedPersona?.id as number),
    ) as RoomMember;
    const adminPersona = roomPersonaList.find(
      (persona: RoomMember) => currentRoom.regiPersonaId === persona?.personaId,
    ) as RoomMember;

    if (!adminPersona || myPersona.personaId === adminPersona.personaId)
      setPersonaList([
        myPersona,
        ...roomPersonaList.filter(
          (persona: RoomMember) =>
            persona?.personaId !== (userStore.selectedPersona?.id as number) &&
            currentRoom.regiPersonaId !== persona?.personaId,
        ),
      ]);
    else
      setPersonaList([
        myPersona,
        adminPersona,
        ...roomPersonaList.filter(
          (persona: RoomMember) =>
            persona?.personaId !== (userStore.selectedPersona?.id as number) &&
            currentRoom.regiPersonaId !== persona?.personaId,
        ),
      ]);
  }, [roomPersona]);

  // const handleClickChatButton = async () => {
  //   if (!userStore.selectedPersona) return;
  //   const res = await roomStore.createRoom({
  //     appId: 1,
  //     roomTypeId: 3,
  //     isEntryRequestApprovable: false,
  //     roomProfileImagePath: '',
  //     selectedPersonaIdList: [
  //       userStore.selectedPersona.id,
  //       uiStore.selectedPersonaId,
  //     ],
  //     selectedRoomIdList: [],
  //   });
  //   if (res.result === 'created') {
  //     roomStore.setCurrentRoomId(res.room.id);
  //   }
  // };

  return (
    <>
      <S.RoomMenuIconWrapper
        onClick={handleClick}
        hasText={configStore.ShowHeaderItemName}
      >
        <Icon.MenuLine width={20} height={20} />
        {configStore.ShowHeaderItemName && '메뉴'}
      </S.RoomMenuIconWrapper>
      <Mui.Popover
        anchorEl={uiStore.roomMenuAnchorEl}
        open={!!uiStore.roomMenuAnchorEl}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '320px',
            borderRadius: '12px',
            marginTop: '8px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={{
          enter: 300,
          exit: 0,
        }}
        disableRestoreFocus
      >
        <S.MenuContentWrapper>
          <RoomMenuItems
            title={configStore.headerMenuTitle}
            menuItems={[
              <Notice closeMenu={handleClose} key="room_menu_notice" />,
              !roomType.isMyRoom && (
                <Vote closeMenu={handleClose} key="room_menu_vote" />
              ),
            ]}
            key={'talk_board'}
          />
          {roomMenuItems}
          {configStore.headerMenuAppsTitle === '첨부함' && (
            <RoomMenuItems
              title={configStore.RoomMenuItemsType.File ? '첨부함' : ''}
              menuItems={[
                configStore.RoomMenuItemsType.File && (
                  <Files closeMenu={handleClose} key="room_menu_files" />
                ),
                configStore.RoomMenuItemsType.Link && (
                  <Links closeMenu={handleClose} key="room_menu_links" />
                ),
              ]}
              key={'talk_attach'}
            />
          )}
          {configStore.FooterMenuItems.Mail &&
            !!roomStore.getRoomById(roomStore.currentRoomId as number)
              ?.mail && (
              <RoomMenuItems
                title="WAPL 앱"
                menuItems={[
                  !roomType.isMyRoom && (
                    <Mails closeMenu={handleClose} key="room_menu_mails" />
                  ),
                ]}
                key={'talk_wapl_menu'}
              />
            )}
          {!roomType.isMyRoom && (
            <RoomMenuItems
              title={`${configStore.FeatureNameType.Room} 멤버`}
              menuItems={[
                isInvitationPossible && <MemberInvite key={'member_invite'} />,
                isLinkSharePossible && <JoinLinkCopy key={'join_link'} />,
              ]}
              key={'room_member'}
            />
          )}

          {!roomType.isMyRoom && (
            <S.RoomMembersListWrapper>
              {personaList.map((persona: RoomMember) => (
                <Member key={persona.personaId} persona={persona} />
              ))}
            </S.RoomMembersListWrapper>
          )}
        </S.MenuContentWrapper>

        <S.Divider key={1} />
        <RoomMenuFooter
          roomFooterMenuItems={[
            <Star key="star" />,
            // !roomType.isMyRoom && <Alarm key="room_menu_footer_alarm" />,
            !roomType.isMyRoom && <Setting key="room_menu_footer_setting" />,
          ]}
          key={'room_menu_footer'}
        />
      </Mui.Popover>
    </>
  );
});

export * from './RoomMenuFooter';
export { RoomMenuItem } from './RoomMenuItem';
export default RoomMenu;
