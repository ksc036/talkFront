import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import React, { useCallback, useEffect, useMemo } from 'react';
import type { MutableRefObject } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';

import { WaplTheme } from '@wapl/ui';
import { Sources, StringMap } from 'quill';

import { EmoticonKey } from '@/@types';
import { Wrapper } from '@/components/Desktop/TalkFooter/LargeFooter/TalkQuill/Styled';
import { EmoticonModel } from '@/models';
import { EditorStore } from '@/stores/EditorStore';
import '@/components/Desktop/TalkFooter/DefaultFooter/TalkQuill/QuillEmoticon';
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
  readOnly?: boolean;
  quillFormats?: [];
  theme?: WaplTheme;
  mentionColor: string;
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
      maxLength = 5000,
      placeholder = '메시지를 입력하세요',
      readOnly = false,
      quillFormats = ['mention', 'emoticon'],
      mentionColor,
    } = props;
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
        ...mergeObjectByArray(modules),
      }),
      [keyBindings, modules],
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
        }

        delta.ops?.forEach((data: any) => {
          if (typeof data?.insert === 'string') {
            // 이모티콘 처리
            const emoticons = content.match(/:.*?:/g) ?? [];
            emoticons.forEach((key: EmoticonKey) => {
              const emoji = EmoticonModel.getEmoticon(key, true);
              const index = editorStore.getText().indexOf(key);
              if (emoji && index !== -1) {
                editorStore.deleteText(index, key.length);
                editorStore.insertEmbed(index, emoji.type, {
                  src: emoji.image,
                  type: emoji.type,
                  alt: emoji.key,
                  colons: `:${emoji.key}:`,
                });
                editorStore.setCursor(index + 1);
              }
            });
          }
        });
      },
      [maxLength, editorStore],
    );

    useEffect(() => {
      editorStore.setQuillRef(ref as MutableRefObject<ReactQuill>);
      setTimeout(() => {
        editorStore.setCursorEnd();
      }, 0);
    }, [ref, editorStore, autoFocus, quillModules, roomId]);

    // TODO: 클립보드? - 기획에 따라
    return (
      <Wrapper theme={theme} id="talk-quill" mentionColor={mentionColor}>
        <ReactQuill
          key={roomId}
          ref={ref}
          theme="bubble"
          placeholder={placeholder}
          readOnly={readOnly}
          value={editorStore.content}
          onChange={handleChange}
          formats={quillFormats}
          modules={quillModules}
          className="notranslate" // 크롬 자동 번역을 켰을 때 Quill 에디터 내용이 사라지는 이슈를 막기 위해 추가
        />
      </Wrapper>
    );
  }),
);

export default TalkQuill;
