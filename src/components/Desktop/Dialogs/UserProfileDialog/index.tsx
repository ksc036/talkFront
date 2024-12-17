// import { useState } from 'react';

import { PopoverOrigin } from '@mui/material';
import { useShell } from '@shell/sdk';
import { Profile, useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { AppIds } from '@/@types';
import { useStore } from '@/stores';
// import ProfileMenuModal from './ProfileMenuModal';
import { getDmRoomTypeId } from '@/utils';

import { ReactComponent as NoteFill } from '../../../../assets/icons/NoteFill.svg';

import * as S from './styled';

const UserProfileDialog = observer(() => {
  const shell = useShell();

  const { userStore, roomStore } = useCoreStore();
  const { uiStore, configStore } = useStore();
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [textValue, setTextValue] = useState('');
  // const [textEditMode, setTextEditMode] = useState(false);

  const anchorOrigins: Record<string, PopoverOrigin> = {
    myMention: {
      vertical: 'center',
      horizontal: 'left',
    },
    otherMention: {
      vertical: 'center',
      horizontal: 'right',
    },
    roomMenuList: {
      vertical: 'center',
      horizontal: 'left',
    },
    headerProfile: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    myUnreadList: {
      vertical: 'top',
      horizontal: 'left',
    },
    otherUnreadList: {
      vertical: 'top',
      horizontal: 'right',
    },
    messageProfile: {
      vertical: 'bottom',
      horizontal: 'right',
    },
  };

  const transformOrigins: Record<string, PopoverOrigin> = {
    myMention: {
      vertical: 'center',
      horizontal: 'right',
    },
    otherMention: {
      vertical: 'center',
      horizontal: 'left',
    },
    roomMenuList: {
      vertical: 'top',
      horizontal: 'right',
    },
    myUnreadList: {
      vertical: 'top',
      horizontal: 'right',
    },
    otherUnreadList: {
      vertical: 'top',
      horizontal: 'left',
    },
    messageProfile: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  const handleClickChatButton = async () => {
    uiStore.setDesktopProfileAnchorEl(null);
    if (!uiStore.selectedPersonaId) return;
    const res = await roomStore.createRoom({
      appId: window.APP_ID,
      roomTypeId: getDmRoomTypeId(),
      isEntryRequestApprovable: false,
      roomProfileImagePath: '',
      selectedPersonaIdList: [uiStore.selectedPersonaId as number],
      selectedRoomIdList: [],
    });
    if (res.result === 'created') {
      roomStore.setCurrentRoomId(res.room.id);
    }
  };

  const handleClickMyChatButton = () => {
    uiStore.setDesktopProfileAnchorEl(null);
    if (roomStore.myRoom?.id) {
      roomStore.setCurrentRoomId(roomStore.myRoom?.id);
    }
  };

  const handleClickMessageButton = async () => {
    await shell.runApp({
      appId: `${AppIds.MESSAGE}`,
      args: {
        type: 'write',
        writeType: 'new',
        personaId: uiStore.selectedPersonaId,
      },
      options: { isWindow: true, width: 1200, height: 800 },
    });
  };

  const handleClickSettingButton = () => {
    uiStore.setDesktopProfileAnchorEl(null);
    shell.openSetting();
  };

  // const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleChange = (e: string) => {
  //   setTextValue(e);
  // };

  if (userStore.selectedPersona?.id === uiStore.selectedPersonaId) {
    return (
      <>
        <Profile
          open={!!uiStore.desktopProfileAnchorEl}
          onClose={() => uiStore.setDesktopProfileAnchorEl(null)}
          anchorEl={uiStore.desktopProfileAnchorEl}
          anchorOrigin={anchorOrigins[uiStore.desktopProfilePosition]}
          transformOrigin={transformOrigins[uiStore.desktopProfilePosition]}
        >
          <Profile.AppBarContent>
            <S.HeaderWrapper onClick={handleClickSettingButton}>
              <Icon.SettingLine color="white" />
            </S.HeaderWrapper>
          </Profile.AppBarContent>
          <Profile.FNBContainer isEdit>
            <Profile.FNBBtn
              title={`나와의 ${configStore.FeatureNameType.Talk}`}
              onClick={handleClickMyChatButton}
              icon={
                <S.IconWrapper>
                  <Icon.ChatFill width={24} height={24} />
                </S.IconWrapper>
              }
            />
          </Profile.FNBContainer>
        </Profile>
      </>
    );
  }

  return (
    <>
      <Profile
        open={!!uiStore.desktopProfileAnchorEl}
        personaId={uiStore.selectedPersonaId}
        onClose={() => uiStore.setDesktopProfileAnchorEl(null)}
        anchorEl={uiStore.desktopProfileAnchorEl}
        anchorOrigin={anchorOrigins[uiStore.desktopProfilePosition]}
        transformOrigin={transformOrigins[uiStore.desktopProfilePosition]}
      >
        {/*<Profile.AppBarContent>
           <S.HeaderWrapper> 
           Todo: 즐겨찾기 기능 추후 포함
           <Icon.BookmarkLine /> 
           Todo: 메모 기능 추후 포함 
           <span onClick={handleMenuClick}>
              <Icon.MoreLine />
            </span>
          </S.HeaderWrapper> 
        </Profile.AppBarContent>*/}
        {/* {uiStore.selectedPersona.profileStatusMsg && (
          <Profile.ContentExplainBox
            label="소개"
            value={uiStore.selectedPersona.profileStatusMsg}
          ></Profile.ContentExplainBox>
        )} */}
        {/* {textEditMode && (
          <Profile.textarea
            label="메모"
            placeholder="메모를 작성해주세요."
            value={textValue}
            maxLength={50}
            onChange={handleChange}
          />
        )} */}
        <Profile.FNBContainer>
          <Profile.FNBBtn
            title={configStore.FeatureNameType.Talk}
            onClick={handleClickChatButton}
            icon={
              <S.IconWrapper>
                <Icon.ChatFill width={24} height={24} />
              </S.IconWrapper>
            }
          />
          {configStore.ProfileDialogMessageButton && (
            <Profile.FNBBtn
              title={'쪽지'}
              onClick={handleClickMessageButton}
              icon={
                <S.IconWrapper>
                  <NoteFill width={24} height={24} />
                </S.IconWrapper>
              }
            />
          )}
        </Profile.FNBContainer>
      </Profile>
      {/* <ProfileMenuModal
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setTextEditMode={setTextEditMode}
      /> */}
    </>
  );
});

export default UserProfileDialog;
