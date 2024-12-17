import { MouseEvent, useState, useEffect } from 'react';

import { useCoreStore, RoomMember, getDefaultImageURL } from '@wapl/core';
import { Mui, Avatar, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';

import * as S from './Styled';

interface UnreadCountUserProps {
  anchorEl: null | HTMLElement;
  closeUnreadMenu: () => void;
  roomId: number;
  msgId: number;
  menuType: string;
  isMine: boolean;
}

interface UnreadUserItemProps {
  roomMember: RoomMember;
  isMine: boolean;
}

const UnreadUserItem = observer((props: UnreadUserItemProps) => {
  const { roomMember, isMine } = props;
  const { uiStore } = useStore();

  const handleOnClickProfile = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    uiStore.setSelectedPersonaId(roomMember.personaId);
    uiStore.setDesktopProfileAnchorEl(event.currentTarget);
    if (isMine) uiStore.setDesktopProfilePosition('myUnreadList');
    else uiStore.setDesktopProfilePosition('otherUnreadList');
  };

  const defaultImage = getDefaultImageURL({
    type: 'PROFILE',
    personaId: roomMember.personaId as number,
  });

  return (
    <>
      <S.ListItem key={roomMember.personaId} onClick={handleOnClickProfile}>
        <Avatar
          size={36}
          imgSrc={
            roomMember.profileImageFilepath !== ''
              ? roomMember.profileImageFilepath
              : defaultImage
          }
        />
        <S.ListItemText>{roomMember.personaNick}</S.ListItemText>
      </S.ListItem>
    </>
  );
});

const UnreadCountUser = observer((props: UnreadCountUserProps) => {
  const { anchorEl, closeUnreadMenu, roomId, msgId, menuType, isMine } = props;
  const { messageStore } = useStore();
  const { roomStore } = useCoreStore();
  const [unreadMemberList, setUnreadMemberList] = useState<RoomMember[] | null>(
    null,
  );

  const theme = useTheme();

  useEffect(() => {
    if (!anchorEl) return;
    const personaList = roomStore.getRoomMemberList(
      roomStore.currentRoomId as number,
    );
    const unreadUserIdList = messageStore.lastReadMessageIdMap
      .get(roomId)
      ?.map((item) => {
        if (item.lastReadMsgId < msgId) return item.personaId;
      });

    setUnreadMemberList(
      personaList.filter((persona: RoomMember) => {
        if (unreadUserIdList) {
          return unreadUserIdList.some((id) => {
            return id === persona.personaId;
          });
        }
      }),
    );
  }, [anchorEl]);

  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={!!anchorEl && menuType === 'Unread'}
      onClose={closeUnreadMenu}
      PaperProps={{
        sx: Object.assign(S.PaperStyle, {
          backgroundColor: theme.Color.Background[2],
        }),
        style: {
          marginLeft: isMine ? '-8px' : '8px',
        },
      }}
      anchorOrigin={
        isMine
          ? {
              vertical: 'top',
              horizontal: 'right',
            }
          : {
              vertical: 'top',
              horizontal: 'left',
            }
      }
      transformOrigin={
        isMine
          ? {
              vertical: 'top',
              horizontal: 'right',
            }
          : {
              vertical: 'top',
              horizontal: 'left',
            }
      }
    >
      {unreadMemberList &&
        unreadMemberList.map((roomMember) => {
          return (
            <UnreadUserItem
              key={roomMember.personaId}
              roomMember={roomMember}
              isMine={isMine}
            />
          );
        })}
    </Mui.Menu>
  );
});

export default UnreadCountUser;
