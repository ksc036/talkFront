import { useMemo } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import InvalidFileMessage from '../InvalidFileMessage';

import * as S from './styled';

interface ThumbnailProps {
  documentId: number;
  thumbnailURL: string;
}

interface ImageMessageProps {
  thumbnails: ThumbnailProps[];
  onClick: (fileIndex: number) => void;
  length: number;
  tempId?: string;
  width: number;
  height: number;
  isThumbnailLoaded: boolean;
}

const ImageMessage = observer((props: ImageMessageProps) => {
  const {
    thumbnails,
    onClick,
    length,
    tempId,
    width,
    height,
    isThumbnailLoaded,
  } = props;
  const { talkStore } = useStore();

  // 이미지 세 개 있는 행 개수
  const threeRows = useMemo(() => {
    switch (length % 3) {
      case 0:
        return length / 3;
      case 1:
        return Math.floor(length / 3) - 1 > 0 ? Math.floor(length / 3) - 1 : 0;
      case 2:
        return Math.floor((length - 2) / 3);
      default:
        return 0;
    }
  }, [length]);

  // 이미지 메시지 전송 중 인지 확인
  const isTempMessage =
    thumbnails?.filter((thumbnail) => isNaN(thumbnail?.documentId))?.length >
      0 ?? false;

  // 전체 높이
  const gridHeight = useMemo(() => {
    const twoRows = (length - 3 * threeRows) / 2; // 이미지 두 개 있는 행 개수
    const allRows = (length - threeRows) / 2; // 전체 행 개수
    const itemHeight = isMobile()
      ? { large: 180, medium: 100, small: 72 }
      : { large: 270, medium: 134, small: 88 };

    return (
      (length === 1
        ? itemHeight.large
        : itemHeight.small * threeRows +
          itemHeight.medium * twoRows +
          4 * (allRows - 1)) * (talkStore.isMini ? 0.75 : 1)
    );
  }, [length, threeRows]);

  const gridItems = Array.from({ length: length }, (_, idx) =>
    !thumbnails || thumbnails.length === 0 || thumbnails[idx]?.thumbnailURL ? (
      <S.ItemWrapper key={idx}>
        {thumbnails[idx]?.thumbnailURL ? (
          <S.Item
            src={thumbnails[idx].thumbnailURL}
            onClick={() => onClick(idx)}
            isTempMessage={isTempMessage}
          />
        ) : (
          <S.ItemPlaceholder />
        )}
      </S.ItemWrapper>
    ) : (
      <InvalidFileMessage
        showText={false}
        key={idx}
        tempId={tempId}
        isThumbnailLoaded={isThumbnailLoaded}
      />
    ),
  );

  return (
    <S.Wrapper height={gridHeight}>
      {length > 1 ? (
        <S.GridWrapper
          isTempMessage={isTempMessage}
          isMobile={isMobile()}
          isMini={talkStore.isMini}
          rows={threeRows}
        >
          {gridItems}
        </S.GridWrapper>
      ) : thumbnails[0]?.thumbnailURL ? (
        <S.SingleItem
          isTempMessage={isTempMessage}
          isMobile={isMobile()}
          isMini={talkStore.isMini}
          src={thumbnails[0].thumbnailURL}
          onClick={() => onClick(0)}
        />
      ) : (
        <S.InvalidImageWrapper width={width} height={height}>
          <InvalidFileMessage
            showText={true}
            tempId={tempId}
            isThumbnailLoaded={isThumbnailLoaded}
          />
        </S.InvalidImageWrapper>
      )}
    </S.Wrapper>
  );
});

export default ImageMessage;
