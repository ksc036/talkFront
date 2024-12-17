import { RunSubAppParams, useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';

import { AppIds } from '@/@types';
import { useStore } from '@/stores';

export type InstanceId = string;
export type DriveAppType = 0 | 1; // 0: docs 기본앱 타입, 1: 톡 첨부함 타입

const useSubApp = () => {
  const { roomStore } = useCoreStore();
  const { subAppStore } = useStore();
  const shell = useShell();

  const openCalendarApp = async () => {
    const params: RunSubAppParams = {
      appId: AppIds.CALENDAR.toString(),
      args: {
        from: 'talk',
        roomId: roomStore.currentRoomId,
      },
    };
    const { instanceId } = await shell.runSubApp(params);
    if (instanceId) subAppStore.setCalendarInstance(instanceId);
  };

  const openDriveApp = async ({
    docsAppType,
  }: {
    docsAppType: DriveAppType;
  }) => {
    const params: RunSubAppParams = {
      appId: AppIds.DOCS.toString(),
      args: {
        runToppingType: 0,
        docsAppType, // 0: docs 기본앱 타입, 1: 톡 첨부함 타입
        roomId: roomStore.currentRoomId,
      },
    };
    const { instanceId } = await shell.runSubApp(params);
    if (instanceId) {
      if (docsAppType === 1) subAppStore.setTalkDriveInstance(instanceId);
      else if (docsAppType === 0) subAppStore.setDriveInstance(instanceId);
    }
  };

  const closeCalendarApp = async () => {
    const { instanceId } = await shell.stopApp({
      instanceId: subAppStore.calendarInstance,
    });
    if (instanceId) subAppStore.setCalendarInstance('');
  };

  const closeDriveApp = async ({
    docsAppType,
  }: {
    docsAppType: DriveAppType;
  }) => {
    const id =
      docsAppType === 1
        ? subAppStore.talkDocsInstance
        : subAppStore.docsInstance;
    const { instanceId } = await shell.stopApp({
      instanceId: id,
    });
    if (instanceId) {
      if (docsAppType === 1) subAppStore.setTalkDriveInstance('');
      else if (docsAppType === 0) subAppStore.setDriveInstance('');
    }
  };

  const closeSubApp = async () => {
    await closeDriveApp({ docsAppType: 1 });
    await closeDriveApp({ docsAppType: 0 });
    await closeCalendarApp();
  };

  return {
    openCalendarApp,
    closeCalendarApp,
    openDriveApp,
    closeDriveApp,
    closeSubApp,
  };
};

export default useSubApp;
