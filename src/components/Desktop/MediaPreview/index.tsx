import { useState } from 'react';

import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import useDownloadFile from '@/hooks/useDownloadFile';
import { useStore } from '@/stores';
import { getAttachmentItemInfo } from '@/utils';

import ModalPortal from '../TalkBody/ModalPortal';

import ImageViewer from './ImageViewer';
import * as S from './Styled';
import VideoPlayer from './VideoPlayer';

const MediaPreview = observer(() => {
  const { uiStore, fileStore } = useStore();
  const { downloadFile } = useDownloadFile();

  const [showVideoInfo, setShowVideoInfo] = useState<boolean>(false);

  const { type, icon } = getAttachmentItemInfo(
    fileStore.mediaPreviewMeta?.extension as string,
  );

  const handleVideoInfoButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShowVideoInfo((prev: boolean) => !prev);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (fileStore.mediaPreviewData && fileStore.mediaPreviewMeta) {
      downloadFile({
        fileBlob: fileStore.mediaPreviewData?.file,
        fileName: fileStore.mediaPreviewMeta?.title,
        fileExtension: fileStore.mediaPreviewMeta?.extension,
      });
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    uiStore.setOpenMediaPreview(false);
    fileStore.setMediaPreviewMeta(null);
    URL.revokeObjectURL(fileStore.mediaPreviewData?.source || '');
  };

  const mediaName = fileStore.mediaPreviewMeta
    ? `${fileStore.mediaPreviewMeta?.title}.${fileStore.mediaPreviewMeta?.extension}`
    : '';

  const container = uiStore.showFullScreenViewer
    ? document.body
    : document.getElementById('TalkContainer');

  return (
    <ModalPortal container={container}>
      <S.Overlay onClick={handleClose}>
        <S.MediaHeader>
          {icon}
          <S.MediaName>
            {mediaName.length > 20
              ? mediaName.slice(0, 20).concat('...')
              : mediaName}
          </S.MediaName>

          <S.MediaButtonsWrapper>
            {type === 'video' && (
              <S.MediaButton
                onClick={handleVideoInfoButtonClick}
                disabled={uiStore.mediaPreviewLoading}
              >
                <Icon.InfoLine width={24} height={24} color="white" />
              </S.MediaButton>
            )}

            <S.MediaButton
              onClick={handleDownload}
              disabled={uiStore.mediaPreviewLoading}
            >
              <Icon.DownloadLine width={24} height={24} color="white" />
            </S.MediaButton>

            <S.MediaButton onClick={handleClose}>
              <Icon.CloseLine width={24} height={24} color="white" />
            </S.MediaButton>
          </S.MediaButtonsWrapper>
        </S.MediaHeader>

        <S.MediaContent onContextMenu={(e) => e.preventDefault()}>
          {uiStore.mediaPreviewLoading ? (
            <Icon.Loading2Motion width={60} height={60} />
          ) : (
            {
              image: <ImageViewer />,
              video: (
                <VideoPlayer
                  showVideoInfo={showVideoInfo}
                  setShowVideoInfo={setShowVideoInfo}
                />
              ),
              file: <></>,
            }[type]
          )}
        </S.MediaContent>
      </S.Overlay>
    </ModalPortal>
  );
});

export default MediaPreview;
