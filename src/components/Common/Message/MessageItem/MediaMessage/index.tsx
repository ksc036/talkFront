import React, { useCallback, useEffect, useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import {
  getAttachmentItemInfo,
  getFileExtension,
  getFileName,
  isFulfilled,
  isMobile,
} from '@/utils';

import ImageMessage from './ImageMessage';
import InvalidFileMessage from './InvalidFileMessage';
import * as S from './styled';

interface MediaMessageProps {
  message: MessageModel;
  isReply?: boolean;
  disableHover?: boolean;
}

interface ThumbnailProps {
  documentId: number;
  thumbnailURL: string;
}

const MediaMessage = observer(
  ({ message, isReply, disableHover = false }: MediaMessageProps) => {
    const { fileStore, uiStore, talkStore } = useStore();
    const { personaStore } = useCoreStore();
    const docsStore = useDocsStore();
    const driveStore = docsStore.getDriveStore();

    const msgBody = isReply ? message.parentBody?.msgBody : message.msgBody;

    const [thumbnails, setThumbnails] = useState<ThumbnailProps[]>([]);
    const [isThumbnailLoaded, setIsThumbnailLoaded] = useState<boolean>(false);

    const [parentThumbnail, setParentThumbnail] = useState<string>('');

    const fileType = getAttachmentItemInfo(getFileExtension(msgBody)).type;

    const getThumbnail = async () => {
      const fileThumbnails = msgBody?.files?.map(async (file) => {
        const documentId = Number(file.id);

        // 이미지 메시지 전송 도중 보여주는 썸네일
        if (file.tempURL && fileType === 'image') {
          return { documentId, thumbnailURL: file.tempURL };
        } else {
          if (!isNaN(documentId)) {
            // 이미지가 삭제된 경우 -> 썸네일 조회 X
            if (file?.isDeleted) {
              setIsThumbnailLoaded(true);
              return { documentId, thumbnailURL: null };
            }
            // 이미지가 삭제되지 않은 경우
            else {
              const thumbnailCache = fileStore.getThumbnailCacheMap(documentId);

              // 이미지의 썸네일이 캐시에 있는 경우 -> 썸네일 조회 X
              if (thumbnailCache) {
                setIsThumbnailLoaded(true);
                return { documentId, thumbnailURL: thumbnailCache };
              }

              // 이미지의 썸네일이 캐시에 없는 경우 -> 썸네일 조회 O
              else {
                // 썸네일 조회 API 호출
                const thumbnailData = await driveStore.requestThumbnailData(
                  documentId,
                );

                // 썸네일 조회 성공한 경우
                if (thumbnailData) {
                  const thumbnailURL = URL.createObjectURL(thumbnailData);
                  fileStore.setThumbnailCacheMap(documentId, thumbnailURL);
                  setIsThumbnailLoaded(true);
                  return { documentId, thumbnailURL };
                }

                // 썸네일 조회 실패한 경우
                else {
                  setIsThumbnailLoaded(true);
                  return { documentId, thumbnailURL: null };
                }
              }
            }
          }
        }
      });

      const fulfilled = (
        await Promise.allSettled(fileThumbnails as any[])
      ).filter(isFulfilled);
      const fulfilledImages = fulfilled.map((item) => item.value);
      setThumbnails(fulfilledImages);
    };

    const getParentThumbnail = useCallback(async () => {
      if (msgBody?.files) {
        const file = msgBody.files[0];
        const documentId = Number(file?.id);
        if (!isNaN(documentId)) {
          const thumbnailCache = fileStore.getThumbnailCacheMap(documentId);

          if (thumbnailCache !== undefined) {
            setParentThumbnail(thumbnailCache);
          } else {
            const thumbnailData = await driveStore.requestThumbnailData(
              documentId,
            );

            if (thumbnailData) {
              const thumbnailURL = URL.createObjectURL(thumbnailData);
              setParentThumbnail(thumbnailURL);
              fileStore.setThumbnailCacheMap(documentId, thumbnailURL);
            }
          }
        }
      }
    }, [JSON.stringify(msgBody?.files?.map((file) => file.isDeleted))]);

    const getWidth = () => {
      if (!isMobile() && !isReply)
        return talkStore.isMini ? (3 / 4) * 360 : 360;
      else if (!isMobile() && isReply)
        return talkStore.isMini ? (3 / 4) * 140 : 140;
      else if (isMobile() && !isReply) return 240;
      else return 140;
    };

    const getHeight = () => {
      if (!isMobile() && !isReply)
        return talkStore.isMini ? (3 / 4) * 270 : 270;
      else if (!isMobile() && isReply)
        return talkStore.isMini ? (3 / 4) * 140 : 140;
      else if (isMobile() && !isReply) return 180;
      else return 140;
    };

    useEffect(() => {
      getThumbnail();
      getParentThumbnail();
    }, [JSON.stringify(msgBody?.files?.map((file) => file.isDeleted))]);

    const handlePreview = async (fileIndex: number) => {
      if (talkStore.isMini) {
        uiStore.setOpenMiniChatDisabledDialog(true);
        return;
      }

      const documentId = Number(msgBody?.files?.[fileIndex]?.id);

      if (!isNaN(documentId) && msgBody?.files?.length) {
        if (fileType === 'image' || fileType === 'video') {
          uiStore.setOpenMediaPreview(true);
          uiStore.setMediaPreviewLoading(true);

          fileStore.setMediaPreviewMeta({
            documentId: documentId,
            title: decodeURIComponent(msgBody.files?.[fileIndex].name),
            extension: msgBody.files?.[fileIndex].extension,
            size: msgBody.files?.[fileIndex].size,
            uploader: personaStore.getPersona(message.personaId)?.nick ?? '',
            date: message.createdAt,
          });

          const media = await driveStore.requestDownload(
            Number(msgBody.files?.[fileIndex].id),
          );

          if (media) {
            fileStore.setMediaPreviewData({
              file: media,
              source: URL.createObjectURL(media),
            });
            uiStore.setMediaPreviewLoading(false);
          }
        }
      }
    };

    const handleClick = async (
      event: React.MouseEvent<HTMLElement>,
      fileIndex: number,
    ) => {
      if (isReply || disableHover) return;
      if (talkStore.isMini) {
        uiStore.setOpenMiniChatDisabledDialog(true);
        return;
      }
      event.stopPropagation();
      await handlePreview(fileIndex);
    };

    const mediaSource = !isReply
      ? thumbnails[0]?.thumbnailURL
      : parentThumbnail;

    return (
      <S.Wrapper isReply={isReply}>
        {fileType === 'video' || isReply ? (
          <S.MediaWrapper
            isHover={!disableHover}
            onClick={(event) => handleClick(event, 0)}
          >
            {!mediaSource ? (
              <S.InvalidMediaWrapper
                isReply={isReply}
                width={getWidth()}
                height={getHeight()}
              >
                <InvalidFileMessage
                  showText={true}
                  isThumbnailLoaded={isThumbnailLoaded}
                />
              </S.InvalidMediaWrapper>
            ) : (
              <S.Media
                isReply={isReply}
                src={mediaSource}
                width={getWidth()}
                height={getHeight()}
              />
            )}

            {fileType === 'video' && thumbnails[0]?.thumbnailURL && (
              <S.PlayIconWrapper isReply={isReply}>
                <Icon.PlayFill width={40} height={40} />
              </S.PlayIconWrapper>
            )}
          </S.MediaWrapper>
        ) : (
          <ImageMessage
            thumbnails={thumbnails}
            isThumbnailLoaded={isThumbnailLoaded}
            onClick={handlePreview}
            length={message.msgBody?.files?.length ?? 0}
            tempId={message.tempId}
            width={getWidth()}
            height={getHeight()}
          />
        )}
      </S.Wrapper>
    );
  },
);

export default MediaMessage;
