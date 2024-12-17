import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

interface ImageViewerProps {
  setMediaWidth: Dispatch<SetStateAction<number>>;
  setMediaHeight: Dispatch<SetStateAction<number>>;
}

const ImageViewer = observer(
  ({ setMediaWidth, setMediaHeight }: ImageViewerProps) => {
    const { fileStore } = useStore();

    const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
      setMediaWidth(event.currentTarget?.naturalWidth ?? 0);
      setMediaHeight(event.currentTarget?.naturalHeight ?? 0);
    };

    return (
      <S.ImageViewer
        src={fileStore.mediaPreviewData?.source ?? undefined}
        onClick={(e) => e.stopPropagation()}
        onLoad={handleImageLoad}
      />
    );
  },
);

export default ImageViewer;
