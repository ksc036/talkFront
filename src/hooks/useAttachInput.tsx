import React, { useRef, ChangeEvent, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import { AttachmentItemModel } from '@/models';
import { useStore } from '@/stores';
import { getFileLimitSize, isMobile } from '@/utils';

const DESKTOP_LIMIT = process.env.REACT_APP_PLATFORM === 'sen' ? 900 : 300; // 메가
const MOBILE_LIMIT = process.env.REACT_APP_PLATFORM === 'sen' ? 900 : 300; // 메가
const FILE_LIMIT_SIZE = getFileLimitSize({ DESKTOP_LIMIT, MOBILE_LIMIT });
const TOTAL_FILES_LIMIT_SIZE = 100 * 1024 ** 3; // 100GB
const FILES_LENGTH_LIMIT = 20;

export function checkValid(
  files: FileList | File[],
  attachments: AttachmentItemModel[],
) {
  if (files.length + attachments.length > FILES_LENGTH_LIMIT) {
    return {
      valid: false,
      reason: `${FILES_LENGTH_LIMIT}개까지 첨부 가능합니다.`,
    };
  }
  if ([...files].some((file) => file.size > FILE_LIMIT_SIZE)) {
    return {
      valid: false,
      reason: `파일 용량이 ${
        isMobile() ? MOBILE_LIMIT : DESKTOP_LIMIT
      }MB를 초과하는 경우, 업로드할 수 없습니다.`,
    };
  }
  if (
    [...files].reduce((a, b) => a + b.size, 0) +
      attachments.reduce((a, b) => a + b.size, 0) >
    TOTAL_FILES_LIMIT_SIZE
  ) {
    return {
      valid: false,
      reason:
        '업로드 할 파일의 총 용량이 100GB를 초과하여 업로드할 수 없습니다.',
    };
  }
  return { valid: true, reason: '' };
}

const useAttachInput = (roomId: number) => {
  const { getAttachmentStore, refStore, messageStore } = useStore();
  const [attachRef, setAttachRef] = useState<React.RefObject<HTMLInputElement>>(
    useRef<HTMLInputElement>(null),
  );

  useEffect(() => {
    const ref = refStore.refMap.get('attachRef');
    if (ref) setAttachRef(ref as React.RefObject<HTMLInputElement>);
    else {
      refStore.refMap.set('attachRef', attachRef);
    }
  });

  const attachmentStore = getAttachmentStore(roomId);

  const handleRemove = (item: AttachmentItemModel) => {
    attachmentStore.removeAttachments(item);
  };
  const handleRemoveAll = () => {
    attachmentStore.removeAttachmentsAll();
  };
  const attachments = attachmentStore.attachments;

  const handleAttach = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { valid, reason } = checkValid(e.target.files, attachments);
      if (valid) {
        messageStore.clearSticker();
        await attachmentStore.addAttachments(e.target.files);
      } else {
        attachmentStore.setRejectString(reason);
        attachmentStore.setFailModalVisible(true);
      }
    }
    e.target.value = '';
  };

  const handleDragAttach = async (e: DragEvent) => {
    if (!attachmentStore.readyToUpload) return;
    if (e.dataTransfer?.files) {
      const items = [...e.dataTransfer.items].filter(
        (item) => item.webkitGetAsEntry()?.isDirectory === false,
      );
      const files = items
        .map((item) => item.getAsFile())
        .filter((item) => item !== null);
      const { valid, reason } = checkValid(e.dataTransfer.files, attachments);
      if (valid && files) {
        messageStore.clearSticker();
        await attachmentStore.addAttachments(files as File[]);
      } else {
        attachmentStore.setRejectString(reason);
        attachmentStore.setFailModalVisible(true);
      }
    }
  };

  const handleCopyAndPasteAttach = () => {
    document.onpaste = async (event: ClipboardEvent) => {
      const clipboard = event?.clipboardData?.files;

      if (clipboard) {
        const { valid, reason } = checkValid(clipboard, attachments);

        if (valid && clipboard) {
          await attachmentStore.addAttachments(clipboard);
          if (!attachmentStore.failModalVisible) {
            messageStore.scrollToBottom('auto');
          }
        } else {
          attachmentStore.setRejectString(reason);
          attachmentStore.setFailModalVisible(true);
        }
      }
    };
  };

  const handleFailModalClose = () => {
    attachmentStore.setFailModalVisible(false);
    attachmentStore.clearUnsupportedExtensions();
  };

  const AttachInput = () => {
    return (
      <input
        ref={attachRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleAttach}
        multiple
      />
    );
  };

  const AttachFailModal = observer(() => {
    return (
      <ConfirmDialog
        open={attachmentStore.failModalVisible}
        title="파일 첨부 실패"
        description={attachmentStore.rejectString}
        onClickOk={handleFailModalClose}
      />
    );
  });

  return {
    AttachInput,
    attachments,
    handleRemove,
    handleRemoveAll,
    AttachFailModal,
    handleDragAttach,
    handleCopyAndPasteAttach,
  };
};

export default useAttachInput;
