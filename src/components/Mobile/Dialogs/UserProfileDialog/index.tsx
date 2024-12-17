import { useNavigate } from 'react-router-dom';

import { useShell } from '@shell/sdk';
import { MobileProfile, useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';

import { AppIds } from '@/@types';
import { useStore } from '@/stores';
import { getDmRoomTypeId } from '@/utils';

import { ReactComponent as NoteFill } from '../../../../assets/icons/NoteFill.svg';

import * as S from './styled';

interface UserProfileProps {
  personaId: number;
  isMine: boolean;
}

const UserProfileDialog = (props: UserProfileProps) => {
  const { personaId, isMine } = props;
  const shell = useShell();
  const { roomStore } = useCoreStore();
  const { uiStore, talkStore, configStore } = useStore();
  const navigate = useNavigate();
  const hash = location.hash;
  const { appId } = talkStore;

  const isOpen = hash === '#profile';

  const handleClickSettingButton = () => {
    shell.mobile.mobileUi.settingDialog();
  };

  const handleClickChatButton = async () => {
    if (!personaId) return;
    const res = await roomStore.createRoom({
      appId: window.APP_ID,
      roomTypeId: getDmRoomTypeId(),
      isEntryRequestApprovable: false,
      roomProfileImagePath: '',
      selectedPersonaIdList: [personaId],
      selectedRoomIdList: [],
    });
    if (res.result === 'created') {
      roomStore.setCurrentRoomId(res.room.id);
      navigate(`/talk/${res.room.id}`, { replace: true });
      uiStore.setSelectedPersonaId(-1);
    }
  };

  const handleClickMyChatButton = async () => {
    if (isMine) {
      await roomStore.fetchRoomDetail({
        roomId: roomStore.myRoom?.id as number,
        appId: appId,
      });
      roomStore.setCurrentRoomId(roomStore.myRoom?.id as number);
      navigate(`/talk/${roomStore.myRoom?.id}`, { replace: true });
    }
    uiStore.setSelectedPersonaId(-1);
  };

  const handleClickMessageButton = async () => {
    await shell.runApp({
      appId: `${AppIds.MESSAGE}`,
      args: {
        type: 'write',
        writeType: 'new',
        personaId: uiStore.selectedPersonaId,
      },
    });
  };

  const handleClose = () => {
    uiStore.setSelectedPersonaId(-1);
    navigate(-1);
  };

  if (isMine)
    return (
      <MobileProfile open={isOpen} onClose={handleClose}>
        <MobileProfile.AppBarContent>
          <S.HeaderWrapper onClick={handleClickSettingButton}>
            <Icon.SettingLine width={24} height={24} />
          </S.HeaderWrapper>
        </MobileProfile.AppBarContent>
        <MobileProfile.FNBBtn
          title={`나와의 ${configStore.FeatureNameType.Talk}`}
          onClick={handleClickMyChatButton}
          icon={
            <S.IconWrapper>
              <Icon.ChatFill width={24} height={24} />
            </S.IconWrapper>
          }
        />
      </MobileProfile>
    );
  else
    return (
      <MobileProfile personaId={personaId} open={isOpen} onClose={handleClose}>
        <MobileProfile.FNBBtn
          title={configStore.FeatureNameType.Talk}
          onClick={handleClickChatButton}
          icon={
            <S.IconWrapper>
              <Icon.ChatFill width={24} height={24} />
            </S.IconWrapper>
          }
        />
        {configStore.ProfileDialogMessageButton && (
          <MobileProfile.FNBBtn
            title={'쪽지'}
            onClick={handleClickMessageButton}
            icon={
              <S.IconWrapper>
                <NoteFill width={24} height={24} />
              </S.IconWrapper>
            }
          />
        )}
      </MobileProfile>
    );
};

export default UserProfileDialog;
