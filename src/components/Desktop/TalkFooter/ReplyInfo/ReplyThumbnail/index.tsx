import React, { useCallback, useEffect, useState } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import { EmoticonModel, MessageModel } from '@/models';
import { useStore } from '@/stores';
import { getAttachmentItemInfo } from '@/utils';

import * as S from './styled';

interface ReplyThumbnailProps {
  targetMessage: MessageModel;
}

const ReplyThumbnail = (props: ReplyThumbnailProps) => {
  const { targetMessage } = props;
  const { fileStore } = useStore();
  const { Color } = useTheme();

  const [thumbnailURL, setThumbnailURL] = useState<string | null | undefined>(
    undefined,
  );

  const getThumbnail = useCallback(() => {
    const documentId = Number(targetMessage?.msgBody?.files?.[0]?.id);

    if (!isNaN(documentId)) {
      const thumbnailCache = fileStore.getThumbnailCacheMap(documentId);

      if (thumbnailCache !== undefined) {
        setThumbnailURL(thumbnailCache);
      } else {
        setThumbnailURL(null);
      }
    }
  }, [targetMessage]);

  useEffect(() => {
    getThumbnail();
  }, [targetMessage]);

  if (
    targetMessage.msgType.includes('sticker') &&
    targetMessage.msgBody.sticker
  ) {
    return (
      <S.ReplyEmoticonWrapper
        src={
          EmoticonModel.getEmoticon(targetMessage.msgBody.sticker)?.thumbnail
        }
      />
    );
  } else if (targetMessage.msgType.includes('file')) {
    return (
      <S.ReplyFileWrapper>
        {
          getAttachmentItemInfo(
            targetMessage.msgBody.files?.[0].extension ?? '',
          )?.icon
        }
      </S.ReplyFileWrapper>
    );
  } else if (
    targetMessage.msgType.includes('image') ||
    targetMessage.msgType.includes('video')
  ) {
    return (
      <S.ReplyThumbnailWrapper>
        {thumbnailURL ? (
          <>
            <S.ReplyThumbnail src={thumbnailURL} />
            {targetMessage.msgType.includes('video') && (
              <S.PlayIconWrapper>
                <Icon.PlayFill width={24} height={24} />
              </S.PlayIconWrapper>
            )}
          </>
        ) : (
          <S.InvalidFileThumbnail>
            <Icon.CorruptedFill
              width={22}
              height={22}
              color={Color.Gray[400]}
            />
          </S.InvalidFileThumbnail>
        )}
      </S.ReplyThumbnailWrapper>
    );
  } else {
    return <></>;
  }
};

export default ReplyThumbnail;
