import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { MutableRefObject } from 'react';
import ReactQuill, { Quill, UnprivilegedEditor } from 'react-quill';

import { WaplTheme } from '@wapl/ui';
import { Sources, StringMap, RangeStatic } from 'quill';

import { EmoticonKey } from '@/@types';
import { Wrapper } from '@/components/Desktop/TalkFooter/DefaultFooter/TalkQuill/Styled';
import { EmoticonModel } from '@/models';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
// import './QuillEmoticon';
import '@/components/Desktop/TalkFooter/DefaultFooter/TalkQuill/QuillEmoticon';
import 'quill-mention';
import './HyperLink';
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
}

const KeyCode = {
  ENTER: 13,
  ARROWDOWN: 40,
  ARROWUP: 38,
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
      quillFormats = [
        'mention',
        'emoticon',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'color',
        'hyperLink',
      ],
    } = props;
    const { uiStore, configStore } = useStore();
    const keyBindings = useMemo(
      () => ({
        enter: {
          ctrlKey: false,
          key: KeyCode.ENTER,
          handler() {
            if (handleEnter) return;
          },
        },
        ArrowDown: {
          ctrlKey: false,
          key: KeyCode.ARROWDOWN,
          handler() {
            if (!uiStore.openMention) return true;
            else return;
          },
        },
        ArrowUp: {
          ctrlKey: false,
          key: KeyCode.ARROWUP,
          handler() {
            if (!uiStore.openMention) return true;
            else return;
          },
        },
        //   ctrlEnter 고려?
      }),
      [],
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

    const handleChangeSelection = useCallback(
      (
        selection: ReactQuill.Range,
        source: Sources,
        editor: ReactQuill.UnprivilegedEditor,
      ) => {
        if (selection && selection.index !== undefined) {
          const textBeforeCursor = editor.getText(0, selection.index);
          const mentionMatch = textBeforeCursor?.match(/(?<=^|\s|\n)@(\S*)$/);
          if (mentionMatch && configStore.MentionType !== 'None') {
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

    useEffect(() => {
      const handleArrowDown = (event: KeyboardEvent) => {
        if (uiStore.openMention) {
          if (event.key === 'ArrowDown') {
            uiStore.setMentionSelected(uiStore.mentionSelected + 1);
          } else if (event.key === 'ArrowUp') {
            uiStore.setMentionSelected(uiStore.mentionSelected - 1);
          }
        }
      };

      document.addEventListener('keydown', handleArrowDown);
      return () => {
        document.removeEventListener('keydown', handleArrowDown);
      };
    }, [uiStore.openMention]);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
        if (!uiStore.openMention) {
          if (handleEnter) handleEnter();
        } else if (uiStore.mentionSelected !== -1) {
          uiStore.setOpenMention(false);
          const index =
            editorStore.quill.selection.savedRange.index -
            uiStore.mentionKeyword.length -
            1;
          editorStore.deleteText(index, uiStore.mentionKeyword.length + 1);

          editorStore.insertEmbed(index, 'mention', {
            denotationChar: '@',
            index: 0,
            id: uiStore.mentionId,
            value: uiStore.mentionNick,
          });
          editorStore.insertText(index + 1, ' ');
          uiStore.setMentionKeyword('');
          uiStore.setMentionSelected(0);
          setTimeout(() => {
            editorStore.setCursor(index + 2, 0);
          });
        }
      } else if (event.key === 'Escape' && uiStore.openMention) {
        uiStore.setOpenMention(false);
      }
    };

    const handleClick = () => {
      const editor = editorStore.quillRef?.current?.getEditor();
      if (editor) {
        editor.on('selection-change', (range: RangeStatic | null) => {
          if (range) {
            if (range.length < 0) {
              editorStore.setCursor(editorStore.getSelection().index);
              const unprivilegedEditor =
                editorStore.quillRef?.current?.makeUnprivilegedEditor(editor);
              handleChangeSelection(
                editorStore.quillRef?.current?.getEditorSelection() as ReactQuill.Range,
                'user',
                unprivilegedEditor as ReactQuill.UnprivilegedEditor,
              );
            }
          }
        });
      }
    };

    // TODO: 클립보드? - 기획에 따라
    return (
      <Wrapper
        theme={theme}
        id="talk-quill"
        onClick={handleClick}
        openToolbar={uiStore.openToolbar}
      >
        <ReactQuill
          key={roomId}
          ref={ref}
          theme="bubble"
          placeholder={placeholder}
          readOnly={readOnly}
          value={editorStore.content}
          onChange={handleChange}
          onChangeSelection={handleChangeSelection}
          formats={quillFormats}
          modules={quillModules}
          onKeyUp={handleKeyDown}
          className="notranslate" // 크롬 자동 번역을 켰을 때 Quill 에디터 내용이 사라지는 이슈를 막기 위해 추가
        />
      </Wrapper>
    );
  }),
);

export default TalkQuill;
