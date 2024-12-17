import { useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore } from '@wapl/core';
import { Icon, Tooltip, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { FileOpenType } from '@/@types';
import useDownloadFile from '@/hooks/useDownloadFile';
import useSubApp from '@/hooks/useSubApp';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import {
  getAttachmentItemInfo,
  getFileExtension,
  getFileName,
  getFormattedSize,
  isMobile,
} from '@/utils';

import * as S from './styled';

interface FileMessageProps {
  message: MessageModel;
  isReply?: boolean;
  disableHover?: boolean;
}

const FileMessage = observer((props: FileMessageProps) => {
  const { talkStore, uiStore, fileStore, configStore } = useStore();
  const { userStore } = useCoreStore();
  const { openDriveApp } = useSubApp();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const { message, isReply, disableHover = false } = props;
  const { Color } = useTheme();
  const { downloadFile } = useDownloadFile();

  const msgBody = isReply ? message.parentBody?.msgBody : message.msgBody;

  const getFileSize = () => {
    if (msgBody?.files?.length) {
      if (msgBody.files[0].size) return getFormattedSize(msgBody.files[0].size);
    }
    return '';
  };

  const getIcon = () => {
    if (msgBody?.files?.length) {
      const { icon } = getAttachmentItemInfo(getFileExtension(msgBody));
      return icon;
    }
  };

  const [isHover, setIsHover] = useState(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleMouseEnter = () => {
    if (disableHover) return;
    if (!message.tempId) setIsHover(true);
  };

  const handleMouseLeave = () => {
    if (disableHover) return;
    if (!message.tempId) setIsHover(false);
  };

  const handleClickDownload = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (isReply || disableHover) return;
    if (talkStore.isMini) {
      uiStore.setOpenMiniChatDisabledDialog(true);
      return;
    }

    if (message.msgBody?.files?.length) {
      const documentId = Number(message.msgBody?.files?.[0]?.id);

      if (!isNaN(documentId)) {
        setIsDownloading(true);
        const documentInfo = await driveStore.requestDocumentInfo(documentId);

        if (documentInfo?.deleted === 0) {
          const media = await driveStore.requestDownload(documentId);

          if (media) {
            event.stopPropagation();

            downloadFile({
              fileBlob: media,
              fileName: message.msgBody.files[0].name,
              fileExtension: message.msgBody.files[0].extension,
            });

            setIsDownloading(false);
          }
        } else {
          setIsDownloading(false);
          setIsHover(false);
          uiStore.openDialog('invalidFile');
        }
      }
    }
  };

  const handleClickOpen = () => {
    if (isReply || disableHover) return;
    if (talkStore.isMini) {
      uiStore.setOpenMiniChatDisabledDialog(true);
      return;
    }
    if (!disableHover && msgBody?.files?.length) {
      const personaId = userStore.selectedPersona?.id as number;
      const documentId = Number(message.msgBody?.files?.[0]?.id);
      const documentExtension = message.msgBody?.files?.[0]?.extension ?? '';

      if (
        configStore.FileOpenType === FileOpenType.HANCOMOFFICE &&
        ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'hwpx', 'hwp'].includes(
          documentExtension,
        )
      ) {
        fileStore.openHancomOffice({
          personaId,
          documentId,
          documentExtension,
        });
      } else {
        openDriveApp({ docsAppType: 1 });
      }
    }
  };

  const tempFileIcon = () => {
    if (isMobile()) {
      return getIcon();
    } else {
      return isDownloading ? (
        <Icon.LoadingMotion />
      ) : isHover ? (
        <Icon.DownloadLine />
      ) : (
        getIcon()
      );
    }
  };

  return (
    <S.FileWrapper
      isReply={isReply}
      onClick={handleClickOpen}
      isHover={!disableHover}
    >
      <S.IconWrapper
        onClick={handleClickDownload}
        isHover={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tempFileIcon()}
      </S.IconWrapper>
      <S.FileInfoWrapper>
        <Tooltip
          title={`${getFileName(msgBody)}.${getFileExtension(msgBody)}`}
          sx={{
            '.MuiTooltip-tooltip': {
              color: Color.Background[0],
              backgroundColor: Color.Gray[900],
            },
          }}
        >
          <S.FileName>{`${getFileName(msgBody)}.${getFileExtension(
            msgBody,
          )}`}</S.FileName>
        </Tooltip>
        <S.FileSize>{getFileSize()}</S.FileSize>
      </S.FileInfoWrapper>
    </S.FileWrapper>
  );
});

export default FileMessage;
