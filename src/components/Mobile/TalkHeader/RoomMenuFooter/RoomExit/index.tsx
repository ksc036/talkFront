import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  // MobileRoomSettingDialog,
  RoomModel,
  useCoreStore,
} from '@wapl/core';
import { Icon } from '@wapl/ui';

import ConfirmDialog from '@/components/Mobile/Dialogs/ConfirmDialog';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import * as S from './styled';

type DialogType = 'roomExit' | 'roomAdminExit' | 'roomExitFail' | 'roomDelete';

const RoomExit = () => {
  const { roomStore } = useCoreStore();
  const { messageStore, configStore, talkStore, uiStore } = useStore();
  const { appId } = talkStore;
  const navigate = useNavigate();
  const currentRoomId = roomStore.currentRoomId as number;
  const currentRoom = roomStore.getRoomById(currentRoomId) as RoomModel;
  const roomType = getRoomType(currentRoom);
  const roomName = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  )?.name;
  // const [roomSettingDialogOpen, setRoomSettingDialogOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>('roomExit');

  const handleSwitchRoom = () => {
    if (configStore.homeType.homeShape === 'my') {
      roomStore.setCurrentRoomId(roomStore.myRoom?.id as number);
    } else {
      roomStore.setCurrentRoomId(0);
    }
  };

  const handleMemberExit = async () => {
    try {
      const result = await roomStore.leaveRoom({
        roomId: currentRoomId,
        appId: appId,
      });
      messageStore.deleteLastReadMessageInfo(currentRoomId);
      if (result.result === 'fail') {
        if (configStore.RoomMenuItemsType.RoomLeaderRoomDelete) {
          setDialogType('roomAdminExit');
        } else setDialogType('roomExitFail');
        setOpenConfirmDialog(true);
      } else {
        navigate(-2);
      }
    } catch (e) {
      console.log('방 나가기 실패', e);
    }
  };

  const handleClickDelete = async () => {
    handleSwitchRoom();

    try {
      await roomStore.deleteRoom({ roomId: currentRoomId, appId: appId });
      messageStore.deleteLastReadMessageInfo(currentRoomId);
      uiStore.openToast(`${roomName}(이)가 삭제되었습니다. `);
    } catch (e) {
      console.log('룸 삭제 실패', e);
    }
  };

  const handleClickFooterExit = () => {
    setOpenConfirmDialog(true);
    roomStore.getRoomById(roomStore.currentRoomId as number)?.memberList
      .length === 1
      ? setDialogType('roomDelete')
      : setDialogType('roomExit');
  };

  const handleClickExit = () => {
    setOpenConfirmDialog(false);
    handleMemberExit();
  };

  const dialogTitle = () => {
    switch (dialogType) {
      case 'roomExit':
        return `${configStore.FeatureNameType.Room} 나가기`;
      case 'roomAdminExit':
        return `${configStore.FeatureNameType.Room} 삭제`;
      case 'roomExitFail':
        return `${configStore.FeatureNameType.Room} 나가기 실패`;
      case 'roomDelete':
        return `${configStore.FeatureNameType.Room} 삭제`;
      default:
        return '';
    }
  };

  const dialogContent = () => {
    switch (dialogType) {
      case 'roomExit':
        let exitContent = configStore.FeatureNameType.RoomExit;
        if (!roomType.isDm && !!configStore.FeatureNameType.RoomExitDesc)
          exitContent += '\n' + configStore.FeatureNameType.RoomExitDesc;
        return exitContent;
      case 'roomAdminExit':
        return `멤버를 모두 내보내고,\n${configStore.FeatureNameType.Room}의 모든 정보를 완전히 삭제하시겠습니까?\n삭제한 이후 다시 복원할 수 없습니다.`;
      case 'roomExitFail':
        return `다른 멤버에게 현재 역할을 양도한 후,\n${configStore.FeatureNameType.Room}을 나갈 수 있습니다.`;
      case 'roomDelete':
        return `${configStore.FeatureNameType.Room} 삭제시, 모든 데이터가 삭제됩니다.\n중요한 데이터가 손실되지 않도록\n주의하세요.`;
      default:
        return '';
    }
  };

  const handleClickOk = useCallback(() => {
    setOpenConfirmDialog(false);
    switch (dialogType) {
      case 'roomExit':
        handleClickExit();
        break;
      case 'roomAdminExit':
        handleClickDelete();
        break;
      case 'roomExitFail':
        navigate('/talk/${roomStore.currentRoomId}/drawer/settings');
        break;
      case 'roomDelete':
        handleClickDelete();
        break;
      default:
        null;
    }
  }, [dialogType]);

  const isOkNegative = () => {
    switch (dialogType) {
      case 'roomExit':
      case 'roomDelete':
        return true;
      default:
        return false;
    }
  };

  const okText = () => {
    switch (dialogType) {
      case 'roomExit':
        return '나가기';
      case 'roomAdminExit':
      case 'roomExitFail':
        return '역할 설정';
      case 'roomDelete':
        return '삭제';
      default:
        return '';
    }
  };

  return (
    <>
      <S.IconWrapper onClick={handleClickFooterExit}>
        <Icon.ExitLine width={20} height={20} />
        {roomType.isDm
          ? configStore.FeatureNameType.DmRoomExitButton
          : '나가기'}
      </S.IconWrapper>
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          title={dialogTitle()}
          content={dialogContent()}
          onClickOk={handleClickOk}
          onClickCancel={() => setOpenConfirmDialog(false)}
          okText={okText()}
          isOkNegative={isOkNegative()}
        />
      )}
      {/* {roomSettingDialogOpen && (
        <MobileRoomSettingDialog
          isOpen={roomSettingDialogOpen}
          onClose={() => {
            navigate(-1);
          }}
          room={currentRoom}
          appId={appId}
          onRemoveRoom={() => {
            navigate(-2);
          }}
        />
      )} */}
    </>
  );
};

export default RoomExit;
