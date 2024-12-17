import { useCallback, useState } from 'react';

import { DesktopRoomSettingDialog, RoomModel, useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import * as S from '@/components/Desktop/Header/RoomMenu/RoomMenuFooter/style';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

interface RoomMenuFooterProps {
  roomFooterMenuItems?: React.ReactNode[];
}

type DialogType = 'roomExit' | 'roomAdminExit' | 'roomExitFail' | 'roomDelete';

export const RoomMenuFooter = observer((props: RoomMenuFooterProps) => {
  const { roomFooterMenuItems } = props;
  const { roomStore } = useCoreStore();
  const { messageStore, configStore, talkStore, uiStore } = useStore();

  const currentRoomId = roomStore.currentRoomId as number;
  const currentRoom = roomStore.getRoomById(currentRoomId) as RoomModel;
  const [openRoomSettingDialog, setOpenRoomSettingDialog] = useState(false);
  const roomType = getRoomType(currentRoom);
  const roomName = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  )?.name;
  const { appId } = talkStore;

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
      const res = await roomStore.leaveRoom({
        roomId: currentRoomId,
        appId: appId,
      });
      messageStore.deleteLastReadMessageInfo(currentRoomId);
      if (res.result === 'fail') {
        if (configStore.RoomMenuItemsType.RoomLeaderRoomDelete) {
          setDialogType('roomAdminExit');
        } else {
          setDialogType('roomExitFail');
        }
        setOpenConfirmDialog(true);
      } else {
        handleSwitchRoom();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickExit = () => {
    setOpenConfirmDialog(false);
    handleMemberExit();
  };

  const handleClickDelete = async () => {
    handleSwitchRoom();

    try {
      await roomStore.deleteRoom({ roomId: currentRoomId, appId: appId });
      messageStore.deleteLastReadMessageInfo(currentRoomId);
      uiStore.openToast(`${roomName}(이)가 삭제되었습니다.`);
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
        return `${configStore.FeatureNameType.Room} 삭제시, 모든 데이터가 삭제됩니다.\n중요한 데이터가 손실되지 않도록 주의하세요.`;
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
        setOpenRoomSettingDialog(true);
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
      case 'roomAdminExit':
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
      case 'roomExitFail':
        return '역할 설정';
      case 'roomAdminExit':
      case 'roomDelete':
        return '삭제';
      default:
        return '';
    }
  };

  return (
    <>
      <S.RoomMenuFooterWrapper>
        {configStore.RoomMenuItemsType.RoomMenuFooterExit &&
          !roomType.isMyRoom &&
          !roomType.isOrg && (
            <S.ExitTitleWrapper onClick={handleClickFooterExit}>
              <S.RoomMenuIcon>
                <Icon.ExitLine width={20} height={20} />
              </S.RoomMenuIcon>
              <span>
                {roomType.isDm
                  ? configStore.FeatureNameType.DmRoomExitButton
                  : '나가기'}
              </span>
            </S.ExitTitleWrapper>
          )}
        <S.RoomFooterMenuIconWrapper>
          {roomFooterMenuItems}
        </S.RoomFooterMenuIconWrapper>
      </S.RoomMenuFooterWrapper>
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
      <DesktopRoomSettingDialog
        open={openRoomSettingDialog}
        onClose={() => setOpenRoomSettingDialog(false)}
        appId={appId}
        roomId={roomStore.currentRoomId}
        onRemoveRoom={() => {
          handleSwitchRoom();
        }}
      />
    </>
  );
});

export { Alarm } from './Alarm';
export { Pin } from './Pin';
export { Setting } from './Setting';
export { Star } from './Star';
