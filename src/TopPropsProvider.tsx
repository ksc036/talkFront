import { createContext } from 'react';

import { AppIds } from '@types';

interface TopPropsProviderProps {
  onFileChipClick?: (fileId?: number | string, roomId?: number) => void;
  children?: React.ReactNode;
  docsUploadCallback?: (fileId: number) => void;
}

export const TopPropsContext = createContext({
  onFileChipClick: (fileId?: number | string, roomId?: number) => {
    try {
      window.parent.postMessage({
        type: 'shell:runTopping',
        appId: AppIds.DOCS,
        args: {
          runToppingType: 2,
          roomId: roomId,
        },
      });
    } catch {
      console.log('error: onFileChipClick');
    }
    return;
  },
  docsUploadCallback: (fileId: number) => {
    return;
  },
});

export const TopPropsProvider = (props: TopPropsProviderProps) => {
  const {
    onFileChipClick = (fileId?: number | string, roomId?: number) => {
      try {
        window.parent.postMessage({
          type: 'shell:runTopping',
          appId: AppIds.DOCS,
          args: {
            runToppingType: 2,
            roomId: roomId,
          },
        });
      } catch {
        console.log('error: onFileChipClick');
      }
      return;
    },
    children,
    docsUploadCallback = (fileId: number) => {
      return;
    },
  } = props;

  return (
    <TopPropsContext.Provider value={{ onFileChipClick, docsUploadCallback }}>
      {children}
    </TopPropsContext.Provider>
  );
};
