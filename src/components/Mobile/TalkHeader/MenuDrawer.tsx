import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useShell } from '@shell/sdk';
import { RoomModel, useCoreStore, RoomMember } from '@wapl/core';
import { Avatar, Mui, useTheme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react-lite';

import { AppIds, AppType, RunToppingMessageType } from '@/@types';
import { useStore } from '@/stores';
import { getRoomType, sortByPersonaName } from '@/utils';

import { Alarm, RoomMenuFooter, Setting } from './RoomMenuFooter';
import JoinLinkCopy from './RoomMenuFooter/JoinLinkCopy';
import { MemberInvite } from './RoomMenuFooter/MemberInvite';
import { Pin } from './RoomMenuFooter/Pin';
import {
  Member,
  Notice,
  RoomMenuItems,
  VerticalRoomMenuButtons,
  RoomMenuButtons,
  Vote,
  Links,
  Files,
  Mails,
  Drive,
  Calendar,
  Meeting,
} from './RoomMenuItems';
import * as S from './styled';

interface TalkProps {
  width?: number | string;
  height?: number | string;
  roomMenuItems?: React.ReactNode[];
  roomFooterMenuItems?: React.ReactNode[];
  windowButton?: React.ReactNode;
  onFileChipClick?: (fileId?: number | string) => void;
  docsUploadCallback?: (fileId: number) => void;
}

const MenuDrawer = observer((props: TalkProps) => {
  const { roomMenuItems } = props;

  const { roomStore, userStore } = useCoreStore();
  const { uiStore, configStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = roomStore.currentRoomId as number;
  const currentRoom = roomStore.getRoomById(roomId) as RoomModel;
  const roomType = getRoomType(currentRoom);
  const { Color } = useTheme();
  const shell = useShell();

  const isInvitationPossible =
    (roomType.isPrivate ||
      (roomType.isDm && configStore.RoomMenuItemsType.DMMemberInvite)) &&
    configStore.RoomMenuItemsType.MemberInvite &&
    roomStore.getRoomById(roomStore.currentRoomId as number)?.myInfo
      ?.isInvitationPossible;

  const isLinkSharePossible =
    roomType.isOpenRoom && configStore.RoomMenuItemsType.InviteURLCopy;

  const isMeetingAvailable = configStore.MeetingAvailableRoomTypeNames.includes(
    currentRoom.typeName,
  );

  const [personaList, setPersonaList] = useState<RoomMember[]>([]);

  const roomPersona = useObserver(() => {
    return roomStore.getRoomMemberList(roomStore.currentRoomId as number);
  }) as RoomMember[];

  const handleClickNotice = () => {
    navigate(`/talk/${roomStore.currentRoomId}/notice#list`, {
      replace: true,
    });
  };

  const handleClickVote = () => {
    navigate(`/talk/${roomStore.currentRoomId}/allvote`, {
      replace: true,
    });
  };

  const handleOnClickProfile = () => {
    navigate(`/talk/${roomStore.currentRoomId}#profile`, {
      replace: true,
    });
  };

  const handleClickDocs = async () => {
    await shell.runApp({
      appId: String(AppIds.DOCS),
      args: {
        runToppingType: RunToppingMessageType.NAVIGATE_TARGET_ROOM,
        docsAppType: AppType.TALKDRIVE,
        roomId: roomStore.currentRoomId,
      },
    });
  };

  const handleClickLinks = () => {
    navigate(`/talk/${roomStore.currentRoomId}/links`, {
      replace: true,
    });
  };

  const handleClickMails = () => {
    // 메일 컴포넌트 연결 필요
    navigate(`/talk/${roomStore.currentRoomId}/mails`, {
      replace: true,
    });
  };

  const handleClickDrive = async () => {
    const res = await shell.runApp({
      appId: String(AppIds.DOCS),
      args: {
        runToppingType: RunToppingMessageType.NAVIGATE_TARGET_ROOM,
        docsAppType: AppType.DOCSDRIVE,
        roomId: roomStore.currentRoomId,
      },
    });

    if (res) {
      shell.mobile.mobileUi.showGnb();
    }
  };

  const handleClickCalendar = async () => {
    const res = await shell.runApp({
      appId: String(AppIds.CALENDAR),
      args: {
        from: 'talk',
        roomId: roomStore.currentRoomId,
      },
    });
    if (res) shell.mobile.mobileUi.showGnb();
  };

  const handleClickMeeting = async () => {
    const res = await shell.runApp({
      appId: String(AppIds.MEETING),
      args: {
        roomId: roomStore.currentRoomId,
        metaMessage: true,
        meetingId: -1,
      },
    });
    if (res) shell.mobile.mobileUi.showGnb();
  };

  useEffect(() => {
    if (location.pathname.includes('drawer')) {
      const roomPersonaList = sortByPersonaName(roomPersona);
      const myPersona = roomPersonaList.find(
        (persona: RoomMember) =>
          persona.personaId === (userStore.selectedPersona?.id as number),
      ) as RoomMember;
      const adminPersona = roomPersonaList.find(
        (persona: RoomMember) =>
          currentRoom.regiPersonaId === persona?.personaId,
      ) as RoomMember;

      if (!adminPersona || myPersona.personaId === adminPersona.personaId)
        setPersonaList([
          myPersona,
          ...roomPersonaList.filter(
            (persona: RoomMember) =>
              persona?.personaId !==
                (userStore.selectedPersona?.id as number) &&
              currentRoom.regiPersonaId !== persona?.personaId,
          ),
        ]);
      else
        setPersonaList([
          adminPersona,
          myPersona,
          ...roomPersonaList.filter(
            (persona: RoomMember) =>
              persona?.personaId !==
                (userStore.selectedPersona?.id as number) &&
              currentRoom.regiPersonaId !== persona?.personaId,
          ),
        ]);
    }
  }, [location.pathname, roomPersona]);

  return (
    <Mui.Drawer
      anchor={'right'}
      open={location.pathname.includes('drawer')}
      onClose={() => {
        navigate(`/talk/${roomStore.currentRoomId}`);
      }}
      sx={{ zIndex: 999 }}
    >
      <Mui.Box
        sx={{
          width: 304,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          backgroundColor: Color.Background[0],
        }}
        role="presentation"
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          <RoomMenuButtons
            title={configStore.headerMenuTitle}
            menuItems={[
              <Notice closeMenu={handleClickNotice} key="notice" />,
              !roomType.isMyRoom && (
                <Vote closeMenu={handleClickVote} key="vote" />
              ),
            ]}
          />
          {configStore.headerMenuAppsTitle && (
            <VerticalRoomMenuButtons
              title={configStore.headerMenuAppsTitle}
              menuItems={[
                configStore.RoomMenuItemsType.File && (
                  <Files closeMenu={handleClickDocs} key="room_menu_files" />
                ),
                configStore.RoomMenuItemsType.Link && (
                  <Links closeMenu={handleClickLinks} key="room_menu_links" />
                ),
                !roomType.isMyRoom && configStore.FooterMenuItems.Mail && (
                  <Mails closeMenu={handleClickMails} key="room_menu_mails" />
                ),
                configStore.HeaderMenuItems.Drive && (
                  <Drive onClick={handleClickDrive} key="room_menu_drive" />
                ),
                configStore.HeaderMenuItems.Calendar && (
                  <Calendar
                    onClick={handleClickCalendar}
                    key="room_menu_calendar"
                  />
                ),
                configStore.HeaderMenuItems.Meeting && isMeetingAvailable && (
                  <Meeting
                    onClick={handleClickMeeting}
                    key="room_menu_meeting"
                  />
                ),
              ]}
              key={'talk_wapl_menu'}
            />
          )}
          {roomMenuItems}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              flex: 1,
            }}
          >
            {!roomType.isMyRoom && (
              <RoomMenuItems
                title={`${configStore.FeatureNameType.Room} 멤버`}
                menuItems={[
                  isInvitationPossible && (
                    <MemberInvite key={'member_invite'} />
                  ),
                  // isLinkSharePossible && <JoinLinkCopy key={'join_link'} />,
                  personaList.map((persona: RoomMember) => (
                    <Member
                      icon={
                        <Avatar
                          size={36}
                          imgSrc={persona.profileImageFilepath ?? ''}
                        />
                      }
                      userName={persona.personaNick}
                      key={persona.personaId}
                      personaId={persona.personaId}
                      onClick={() => {
                        uiStore.setSelectedPersonaId(persona.personaId);
                        handleOnClickProfile();
                      }}
                    />
                  )),
                ]}
                key={'room_member'}
              />
            )}
          </div>

          <S.Divider />
          <RoomMenuFooter
            roomFooterMenuItems={[
              configStore.RoomMenuItemsType.Pin && (
                <Pin key="mobile_menudrawer_pin" />
              ),
              // !roomType.isMyRoom && <Alarm key="mobile_menudrawer_alarm" />,
              // !roomType.isMyRoom && <Setting key="mobile_menudrawer_setting" />,
            ]}
            key={'room_menu_footer'}
          />
        </div>
      </Mui.Box>
    </Mui.Drawer>
  );
});

export default MenuDrawer;
