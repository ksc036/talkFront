import React, { useCallback, useEffect, useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore, RoomModel, PersonaModel } from '@wapl/core';
import {
  Button,
  ContentMenuHeader,
  ContentMenuHeaderButton,
  Icon,
  TabPanel,
} from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import ContactChip from './ContactChip';
import RoomChip from './RoomChip';
import * as S from './styled';

const DeliverContextMenu = observer(() => {
  const { uiStore, messageStore, configStore, talkStore } = useStore();
  const { roomStore, userStore, personaStore } = useCoreStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const { appId } = talkStore;

  const [tabValue, setTabValue] = useState(0);
  const [selectedContact, setSelectedContact] = useState<PersonaModel>();
  const [selectedRoom, setSelectedRoom] = useState<Partial<RoomModel>>();
  const [contactList, setContactList] = useState<PersonaModel[]>([]);
  // SAS 작업 필요
  // const filteredRoomArray = roomStore.roomArray.filter(
  //   (room: RoomModel) => !getRoomType(room).isOrg && room.isVisible,
  // );
  const filteredRoomArray = roomStore.roomList.filter(
    (room: RoomModel) => !getRoomType(room).isOrg && room.isVisible,
  );

  const openMenu = uiStore.openDeliverContextMenu;
  const personaColor = userStore.selectedPersona?.color;

  const handleCloseMenu = useCallback(() => {
    uiStore.closeContextMenu('deliver');
  }, [uiStore]);
  const onClickExpand = useCallback(() => {
    uiStore.openDialog('deliver');
    handleCloseMenu();
  }, []);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedContact(undefined);
    setSelectedRoom(undefined);
    setTabValue(newValue);
  };

  const handleContactCheck = useCallback((inviteeInfo: PersonaModel) => {
    setSelectedContact(inviteeInfo);
  }, []);
  const handleContactUnCheck = useCallback(() => {
    setSelectedContact(undefined);
  }, []);
  const handleRoomCheck = useCallback((inviteeInfo: Partial<RoomModel>) => {
    setSelectedRoom(inviteeInfo);
  }, []);
  const handleRoomUncheck = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  const handleDeliver = async () => {
    if (!selectedContact && !selectedRoom) {
      handleCloseMenu();
      return;
    }
    const message = messageStore.hoveredMessage;
    const myId = userStore.selectedPersona?.id || 1;
    const myNick = personaStore.getPersona(myId)?.nick || 'nick';
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;

    if (message) {
      // 룸 생성
      let roomId = 0;
      if (selectedContact) {
        const res = await roomStore.createRoom({
          appId: window.APP_ID,
          roomTypeId: 3,
          isEntryRequestApprovable: false,
          roomProfileImagePath: '',
          selectedPersonaIdList: [selectedContact.id as number],
        });
        if (res.result === 'created') {
          roomId = res?.room?.id as number;
        }
      } else if (selectedRoom) {
        roomId = selectedRoom.id as number;
      }

      if (!roomId) return;

      // 파일 존재 시 파일 복사
      let copiedFile = {};
      if (message.msgType.includes('file') && message.msgBody?.files?.length) {
        const file = message.msgBody.files[0];
        const res = await driveStore.requestCopy(roomId, [file.id as number]);
        if (res) {
          copiedFile = {
            id: res[0].documentId,
            name: res[0].documentName,
            extension: res[0].documentExtension,
            size: res[0].documentSize,
          };
        }
      }

      // 전달
      const messageBody = {};
      if (message.msgBody.content)
        Object.assign(messageBody, { content: message.msgBody.content });
      if (message.msgBody.ogUrl)
        Object.assign(messageBody, { ogUrl: message.msgBody.ogUrl });
      if (message.msgBody.mention)
        Object.assign(messageBody, { mention: message.msgBody.mention });
      if (message.msgBody.sticker)
        Object.assign(messageBody, { sticker: message.msgBody.sticker });
      if (message.msgBody.files && copiedFile)
        Object.assign(messageBody, { files: [copiedFile] });

      const msgDto = {
        appId: appId,
        msgType: message.msgTypeNumber(),
        msgBody: messageBody,
        rawContent: message.rawContent,
        targetRoomId: roomId,
        nick: myNick,
        roomName: room.name,
      };

      await messageStore.deliverMessage(roomId, msgDto);
    }
  };

  useEffect(() => {
    (async () => {
      if (openMenu) {
        // const res = await contactStore.getContact({ search: '' });
        // if (res) {
        //   setContactList([...res.friendList]);
        // }
      }
    })();
  }, [openMenu]);

  return (
    <S.BottomContextMenu
      anchor={'bottom'}
      open={openMenu}
      onClose={handleCloseMenu}
    >
      <ContentMenuHeader
        rightSide={
          <ContentMenuHeaderButton
            onClick={onClickExpand}
            style={{
              padding: 0,
            }}
          >
            <Icon.ViewListLine width={20} height={20} />
          </ContentMenuHeaderButton>
        }
      >
        {configStore.messageDeliverText}
      </ContentMenuHeader>
      <S.DeliverBody>
        <S.DeliverTabs value={tabValue} onChange={handleTabChange}>
          <S.DeliverTab label={'연락처'} value={0} />
          <S.DeliverTab label={configStore.FeatureNameType.Room} value={1} />
        </S.DeliverTabs>
        <TabPanel value={tabValue} index={0}>
          {contactList.length > 0 && (
            <S.ChipItemWrapper>
              {contactList
                .sort((a, b) => a?.nick?.localeCompare(b.nick))
                .map((member) => (
                  <ContactChip
                    key={`contact_${member.id}`}
                    inviteeInfo={member}
                    onItemCheck={handleContactCheck}
                    onItemUncheck={handleContactUnCheck}
                    checked={selectedContact?.id === member.id}
                    color={personaColor}
                  />
                ))}
            </S.ChipItemWrapper>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <S.ChipItemWrapper>
            {filteredRoomArray.map((room: RoomModel) => (
              <RoomChip
                key={`room_${room.id}`}
                inviteeInfo={room}
                onItemCheck={handleRoomCheck}
                onItemUncheck={handleRoomUncheck}
                checked={selectedRoom?.id === room.id}
                color={personaColor}
              />
            ))}
          </S.ChipItemWrapper>
        </TabPanel>
        <S.ButtonWrapper>
          <Button
            size="extra-large"
            width="100%"
            disabled={!selectedContact && !selectedRoom}
            onClick={handleDeliver}
          >
            {selectedContact || selectedRoom ? '전달' : '취소'}
          </Button>
        </S.ButtonWrapper>
      </S.DeliverBody>
    </S.BottomContextMenu>
  );
});

export default DeliverContextMenu;
