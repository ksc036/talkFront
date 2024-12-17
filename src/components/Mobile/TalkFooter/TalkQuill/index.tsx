import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { MutableRefObject } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';

import { WaplTheme } from '@wapl/ui';
import { useObserver } from 'mobx-react-lite';
import { Sources, StringMap } from 'quill';

import { Wrapper } from '@/components/Mobile/TalkFooter/TalkQuill/Styled';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
// import './QuillEmoticon';
import '@/components/Desktop/TalkFooter/DefaultFooter/TalkQuill/QuillEmoticon';
import 'quill-mention';
import { mergeObjectByArray } from '@/utils';

// Clipboard 등록
// Quill.register('modules/clipboard', TalkClipboard, true);
// 에디터 한 줄 p -> div
const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

interface TalkQuillProps {
  autoFocus?: boolean;
  editorStore: EditorStore;
  roomId?: number;
  handleEnter?: () => void;
  modules?: StringMap[];
  maxLength?: number;
  placeholder?: string;
  quillFormats?: [];
  theme?: WaplTheme;
}

const KeyCode = {
  ENTER: 13,
} as const;

const TalkQuill = React.memo(
  React.forwardRef<ReactQuill, TalkQuillProps>((props, ref) => {
    const {
      theme,
      editorStore,
      roomId,
      autoFocus = true,
      handleEnter = null,
      modules = [],
      maxLength = 2000,
      placeholder = '메시지를 입력하세요',
      quillFormats = ['mention', 'emoticon'],
    } = props;
    const { configStore, uiStore } = useStore();
    const [visible, setVisible] = useState(false);
    const keyBindings = useMemo(
      () => ({
        enter: {
          ctrlKey: false,
          key: KeyCode.ENTER,
          handler() {
            if (handleEnter) handleEnter();
          },
        },
        //   ctrlEnter 고려?
      }),
      [handleEnter],
    );
    const quillModules = useMemo(
      () => ({
        toolbar: false,
        keyboard: {
          bindings: handleEnter ? keyBindings : {},
        },
      }),
      [keyBindings],
    );

    const handleChangeSelection = useCallback(
      (
        selection: ReactQuill.Range,
        source: Sources,
        editor: ReactQuill.UnprivilegedEditor,
      ) => {
        if (selection && selection.index !== undefined) {
          const textBeforeCursor = editor.getText(0, selection.index);
          const mentionMatch = textBeforeCursor?.match(/(?<=^|\s|\n)@(\S*)$/);
          if (mentionMatch) {
            uiStore.setOpenMention(true);
            uiStore.setMentionKeyword(mentionMatch[1].split('@').pop() || '');
            uiStore.setMentionSelected(0);
          } else {
            uiStore.setOpenMention(false);
          }
        }
      },
      [editorStore],
    );

    const handleChange = useCallback(
      (
        content: string,
        delta: any,
        source: Sources,
        editor: UnprivilegedEditor,
      ) => {
        // 최대길이 제한
        if (editor.getLength() > maxLength)
          editorStore.deleteText(maxLength, editor.getLength());

        if (source === 'user') {
          editorStore.update(content, editor);
          handleChangeSelection(editor.getSelection(), source, editor);
        }
      },
      [maxLength, editorStore],
    );

    const content = useObserver(() => editorStore.content);
    useEffect(() => {
      if (editorStore.content.endsWith('<br></div>')) {
        const regex = /<div><br><\/div>$/;
        editorStore.content = editorStore.content.replace(regex, '');
      }
    }, [content]);

    useEffect(() => {
      setVisible(false);
      editorStore.setQuillRef(ref as MutableRefObject<ReactQuill>);
      setTimeout(() => {
        setVisible(true);
      }, 0);
    }, [ref, editorStore, autoFocus, quillModules, roomId]);

    const handleClick = () => {
      editorStore.setCursor(editorStore.getSelection().index);
      const editor = editorStore.quillRef?.current?.getEditor();
      if (editor) {
        const unprivilegedEditor =
          editorStore.quillRef?.current?.makeUnprivilegedEditor(editor);
        handleChangeSelection(
          editorStore.quillRef?.current?.getEditorSelection() as ReactQuill.Range,
          'user',
          unprivilegedEditor as ReactQuill.UnprivilegedEditor,
        );
      }
    };

    // TODO: 클립보드? - 기획에 따라
    if (!visible) return null;
    return (
      <Wrapper
        theme={theme}
        mentionColor={configStore.OtherMessageStyle.MentionColor}
        id="talk-quill"
        onClick={handleClick}
      >
        <ReactQuill
          ref={ref}
          theme="bubble"
          placeholder={placeholder}
          value={content}
          onChange={handleChange}
          onChangeSelection={handleChangeSelection}
          formats={quillFormats}
          modules={quillModules}
          className="notranslate" // 크롬 자동 번역을 켰을 때 Quill 에디터 내용이 사라지는 이슈를 막기 위해 추가
        />
      </Wrapper>
    );
  }),
);

export default TalkQuill;
