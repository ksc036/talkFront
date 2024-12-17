import { useCoreStore } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import useAttachInput from '@/hooks/useAttachInput';
import { useStore } from '@/stores';
import FileItem from '@desktop/TalkFooter/AttachmentItem/FileItem';
import CancelAllButton from '@desktop/TalkFooter/Attachments/CancelAllButton';
import * as S from '@desktop/TalkFooter/Attachments/Styled';

import ImageItem from '../AttachmentItem/ImageItem';
import VideoItem from '../AttachmentItem/VideoItem';

const Attachments = observer(() => {
  const Attachment = {
    video: VideoItem,
    file: FileItem,
    image: ImageItem,
  } as const;
  const { roomStore } = useCoreStore();
  const { configStore } = useStore();
  const roomId = roomStore.currentRoomId as number;
  const theme = useTheme();
  const {
    AttachInput,
    attachments,
    handleRemove,
    handleRemoveAll,
    AttachFailModal,
    handleCopyAndPasteAttach,
  } = useAttachInput(roomId);

  configStore.FooterMenuItems.File && handleCopyAndPasteAttach();

  return (
    <>
      <AttachFailModal />
      <AttachInput />
      {!!attachments.length && (
        <S.Wrapper theme={theme}>
          {attachments.map((item) => {
            const AttachmentItemCompo = Attachment[item.type];
            return (
              <AttachmentItemCompo
                key={item.id}
                item={item}
                handleRemove={handleRemove}
              />
            );
          })}
          <CancelAllButton handleClick={handleRemoveAll} />
        </S.Wrapper>
      )}
    </>
  );
});

export default Attachments;
