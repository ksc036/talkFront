import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';

import { RoomModel, useCoreStore } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';
import { Sources } from 'quill';

import CommonButton from '@/components/Common/Button';
import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import { EmoticonModel } from '@/models';
import { useStore } from '@/stores';
import { isJsonString, unescapeHtml, recoverHiddenRoom } from '@/utils';

import * as S from './styled';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

interface NoticeEditorProps {
  onClose: () => void;
}

const NoticeEditor = observer((props: NoticeEditorProps) => {
  const { onClose } = props;
  const { uiStore, noticeStore, getEditorStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const theme = useTheme();
  const editorStore = getEditorStore(-1);

  const quillRef = useRef<ReactQuill>(null);

  const [hasChange, setHasChange] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [clickedBack, setClickedBack] = useState<boolean>(false);

  const MAX_LENGTH = 5000;

  const handleChange = useCallback(
    (
      content: string,
      delta: any,
      source: Sources,
      editor: UnprivilegedEditor,
    ) => {
      // Todo: 글자수 초과 제한
      if (editor.getLength() > MAX_LENGTH + 1) {
        editorStore.deleteText(MAX_LENGTH, editor.getLength());
      } else {
        editorStore.update(content, editor);
      }

      // quill이 비어있어도 blank link '\n'이 있기 때문에 length는 1이다.
      if (editor.getLength() === 1 || editor.getText().trim().length === 0) {
        setHasChange(false);
      } else {
        setHasChange(true);
      }
    },
    [editorStore],
  );

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleBack = () => {
    if (uiStore.noticeDialogMode === 'create')
      uiStore.setNoticeDialogMode('list');
    else if (uiStore.noticeDialogMode === 'update')
      uiStore.setNoticeDialogMode('read');
  };

  const handleClickBack = () => {
    if (hasChange) {
      setClickedBack(true);
      setOpenConfirmDialog(true);
    } else {
      handleBack();
    }
  };

  const handleClickClose = () => {
    if (hasChange) {
      setClickedBack(false);
      setOpenConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleClickOk = async () => {
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const nick = userStore.selectedPersona?.nick ?? '';
    const parsed = editorStore.getParsed();
    const noticeBody = { content: parsed.parsedText };
    if (parsed.mentions?.length) {
      Object.assign(noticeBody, { mention: JSON.stringify(parsed.mentions) });
    }

    if (uiStore.noticeDialogMode === 'create') {
      await recoverHiddenRoom(room.id);
      await noticeStore.createNotice({
        noticeBody,
        isActive: true,
        roomId: room.id,
        roomName: room.name,
        nick,
      });
      handleBack();
    } else if (uiStore.noticeDialogMode === 'update') {
      const noticeId = noticeStore.currentNoticeId;
      await noticeStore.updateNotice({
        noticeId,
        noticeBody,
        isActive: true,
        roomId: room.id,
        roomName: room.name,
        nick,
      });
      handleBack();
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: false,
    };
  }, []);

  useEffect(() => {
    editorStore.setQuillRef(quillRef);

    if (
      uiStore.noticeDialogMode === 'update' &&
      noticeStore.currentNotice?.noticeBody.content
    ) {
      const serverFormat = noticeStore.currentNotice?.noticeBody.content ?? '';
      const messageArray: string[] = [];
      serverFormat.split(/[\n]/g).forEach((message) => {
        const arr = message
          .split(/[<>]/g)
          .filter((item) => item !== '' && item !== null && item !== undefined);
        const ret = `<p>${arr
          .map((item) => {
            const jsonObject = isJsonString(item);
            if (jsonObject) {
              if (jsonObject.type === 'mention') {
                return `<span class="mention" data-denotation-char="@" data-id="${jsonObject.mentionId}" data-value="${jsonObject.mentionName}"></span>`;
              }
              if (jsonObject.type === 'emoticon') {
                const emoticonData = EmoticonModel.getEmoticon(
                  jsonObject.emoticonName,
                );
                const url = emoticonData?.image;
                const colons = `:${emoticonData?.key}:`;
                return `<img class="emoticon" alt="${colons}" src="${url}" data-alias="${colons}" />`;
              }
            }
            return unescapeHtml(item);
          })
          .join('')}<br /></p>`;
        messageArray.push(ret);
      });
      const content = messageArray.join('');
      const delta = editorStore.quill.clipboard.convert(content);
      editorStore.quill.setContents(delta);
      editorStore.quill.update();
    } else if (uiStore.noticeDialogMode === 'create') {
      editorStore.clear();
    }
    setTimeout(() => {
      editorStore.setCursorEnd();
    }, 0);

    return () => {
      editorStore.clear();
    };
  }, [quillRef, editorStore]);

  return (
    <>
      <CommonDialogHeader
        iconType="back"
        title={
          uiStore.noticeDialogMode === 'create' ? '공지 생성' : '공지 수정'
        }
        onIconClick={handleClickBack}
        onClose={handleClickClose}
      />
      <S.Content>
        <S.CustomReactQuill
          className="notranslate"
          ref={quillRef}
          placeholder={'내용을 입력해 주세요.'}
          value={editorStore.content}
          onChange={handleChange}
          modules={modules}
          formats={['mention', 'emoticon']}
          customTheme={theme}
        />
      </S.Content>
      <S.TextLength>
        <S.TextLengthCurrent
          color={
            editorStore.textLength === 0
              ? theme.Color.Gray[400]
              : configStore.MainColor
          }
        >
          {`${editorStore.textLength}`}
        </S.TextLengthCurrent>
        <S.TextLengthTotal
          color={
            editorStore.textLength === 0
              ? theme.Color.Gray[400]
              : theme.Color.Gray[900]
          }
        >{`/${MAX_LENGTH}`}</S.TextLengthTotal>
      </S.TextLength>
      <S.Footer>
        <CommonButton
          disabled={!hasChange}
          size="large"
          onClick={handleClickOk}
        >
          {uiStore.noticeDialogMode === 'create' ? '생성' : '수정'}
        </CommonButton>
      </S.Footer>
      <ConfirmDialog
        open={openConfirmDialog}
        content={'변경 사항을 저장하지 않고 나가시겠습니까?'}
        onClose={handleCloseConfirmDialog}
        onClickOk={clickedBack ? handleBack : onClose}
        onClickCancel={handleCloseConfirmDialog}
        okText="나가기"
        isOkNegative={true}
      />
    </>
  );
});

export default NoticeEditor;
