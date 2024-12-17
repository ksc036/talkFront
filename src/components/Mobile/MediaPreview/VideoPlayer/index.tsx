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

import * as S from './styled';

interface VideoPlayerProps {
  setMediaWidth: Dispatch<SetStateAction<number>>;
  setMediaHeight: Dispatch<SetStateAction<number>>;
}

const VideoPlayer = observer(
  ({ setMediaWidth, setMediaHeight }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const { fileStore } = useStore();

    const [showPlayButton, setShowPlayButton] = useState<boolean>(true);

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
      setMediaWidth(event.currentTarget?.videoWidth ?? 0);
      setMediaHeight(event.currentTarget?.videoHeight ?? 0);
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
      </S.VideoPlayerWrapper>
    );
  },
);

export default VideoPlayer;
