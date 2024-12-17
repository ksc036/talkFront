import {
  useState,
  useRef,
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
} from 'react';

import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getFormattedSize } from '@/utils';

import * as S from './styled';

interface VideoPlayerProps {
  showVideoInfo: boolean;
  setShowVideoInfo: Dispatch<SetStateAction<boolean>>;
}

const VideoPlayer = observer(
  ({ showVideoInfo, setShowVideoInfo }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const { fileStore } = useStore();

    const [showPlayButton, setShowPlayButton] = useState<boolean>(true);

    const [videoWidth, setVideoWidth] = useState<number>(0);
    const [videoHeight, setVideoHeight] = useState<number>(0);

    const handleVideoPlay = (event: MouseEvent) => {
      event.stopPropagation();

      videoRef?.current?.play();
      setShowPlayButton(false);
    };

    const handleVideoEnded = () => {
      setShowPlayButton(true);
    };

    const handleVideoLoadedMetadata = (
      event: SyntheticEvent<HTMLVideoElement>,
    ) => {
      setVideoWidth(event.currentTarget?.videoWidth ?? 0);
      setVideoHeight(event.currentTarget?.videoHeight ?? 0);
    };

    const handleVideoInfoClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      setShowVideoInfo(false);
    };

    return (
      <S.VideoPlayerWrapper>
        <S.VideoPlayer
          ref={videoRef}
          src={fileStore.mediaPreviewData?.source ?? undefined}
          onEnded={handleVideoEnded}
          onLoadedMetadata={handleVideoLoadedMetadata}
          controls={!showPlayButton}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onClick={(e) => e.stopPropagation()}
        />

        {showPlayButton && (
          <S.PlayButtonWrapper onClick={handleVideoPlay}>
            <Icon.PlayFill width={100} height={100} />
          </S.PlayButtonWrapper>
        )}

        {showVideoInfo && (
          <S.VideoInfoWrapper onClick={handleVideoInfoClick}>
            <S.VideoInfoElementsWrapper>
              <S.VideoInfoLabel>종류</S.VideoInfoLabel>
              <S.VideoInfoValue>
                {fileStore.mediaPreviewMeta?.extension.toUpperCase()}
              </S.VideoInfoValue>
            </S.VideoInfoElementsWrapper>

            <S.VideoInfoElementsWrapper>
              <S.VideoInfoLabel>크기</S.VideoInfoLabel>
              <S.VideoInfoValue>
                {getFormattedSize(fileStore.mediaPreviewMeta?.size ?? 0)}
              </S.VideoInfoValue>
            </S.VideoInfoElementsWrapper>

            <S.VideoInfoElementsWrapper>
              <S.VideoInfoLabel>해상도</S.VideoInfoLabel>
              <S.VideoInfoValue>
                {videoWidth} x {videoHeight}
              </S.VideoInfoValue>
            </S.VideoInfoElementsWrapper>
          </S.VideoInfoWrapper>
        )}
      </S.VideoPlayerWrapper>
    );
  },
);

export default VideoPlayer;
