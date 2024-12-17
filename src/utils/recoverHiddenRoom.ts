// 상대가 룸 나가기를 한 상태인경우 상대의 룸리스트에 룸이 다시 보이도록 해주는 함수
import { RoomModel } from '@wapl/core';

import { rootStore } from '@/stores';
import { getRoomType } from '@/utils';

export const recoverHiddenRoom = async (targetRoomId: number) => {
  try {
    const targetRoom = rootStore.coreStore?.roomStore.getRoomById(
      targetRoomId,
    ) as RoomModel;
    const isDm = getRoomType(targetRoom)?.isDm;
    if (isDm) {
      const user = targetRoom.memberList.find(
        (member) =>
          member.personaId !==
          rootStore.coreStore?.userStore.selectedPersona?.id,
      );
      if (user) {
        await rootStore.coreStore?.roomStore.recoverDmRoom({
          appId: window.APP_ID,
          roomId: targetRoom.id,
          personaId: user.personaId,
        });
      }
    }
  } catch (e) {
    console.log('recoverHiddenRoom e: ', e);
  }
};
