import React, { useEffect, useState } from 'react';

import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';
import { RangeStatic } from 'quill';

import { EditorStore } from '@/stores/EditorStore';

import 'react-quill/dist/quill.bubble.css';

import ColorPicker from './ColorPicker';
import HyperlinkInput from './HyperlinkInput';
import * as S from './Styled';
import ToolbarButton from './ToolbarButton';

interface EditorToolbarProps {
  editorStore: EditorStore;
}

const EditorToolbar = observer((props: EditorToolbarProps) => {
  const { editorStore } = props;
  const { Color } = useTheme();
  const [color, setColor] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);

  const handleFormat = (format: string, value?: string) => {
    const editor = editorStore.quillRef?.current?.getEditor();
    if (editor) {
      const currentFormat = editor.getFormat();

      if (format === 'color') {
        editor.format('color', value, 'user');
        setColor(value ?? Color.Gray[900]);
      } else if (format === 'strike') {
        if (currentFormat.strike) {
          editor.format('strike', false, 'user');
          setIsStrike(false);
        } else {
          editor.format('strike', true, 'user');
          setIsStrike(true);
        }
      } else if (format === 'list') {
        if (currentFormat.list === value) {
          editor.format('list', false, 'user');
          setIsOrderedList(false);
          setIsBulletList(false);
        } else {
          editor.format('list', value, 'user');
          if (value === 'ordered') {
            setIsOrderedList(true);
            setIsBulletList(false);
          } else if (value == 'bullet') {
            setIsBulletList(true);
            setIsOrderedList(false);
          }
        }
      } else {
        if (currentFormat[format]) {
          editor.format(format, false, 'user');
        } else {
          editor.format(format, true, 'user');
        }
        if (format === 'bold') setIsBold(!isBold);
        else if (format === 'italic') setIsItalic(!isItalic);
        else if (format === 'underline') setIsUnderline(!isUnderline);
      }
    }
  };

  const addLink = (url: string, text: string, range: RangeStatic | null) => {
    if (url && text) {
      const editor = editorStore.quillRef?.current?.getEditor();
      if (range && editor) {
        editorStore.insertText(range.index, ' ');
        editor.insertEmbed(range.index, 'hyperLink', { url, text }, 'user');
        setTimeout(() => {
          editor.setSelection({ index: range.index + 2, length: 0 });
        });
      }
    }
  };

  const handleColorChange = (value: string) => {
    handleFormat('color', value);
  };

  useEffect(() => {
    const editor = editorStore.quillRef?.current?.getEditor();
    setColor(Color.Gray[900]);
    if (editor) {
      const handleSelectionChange = (
        range: { index: number; length: number } | null,
      ) => {
        if (range) {
          const currentFormat = editor.getFormat();
          setColor(currentFormat.color || Color.Gray[900]);
          setIsBold(!!currentFormat.bold);
          setIsItalic(!!currentFormat.italic);
          setIsUnderline(!!currentFormat.underline);
          setIsStrike(!!currentFormat.strike);
          setIsBulletList(currentFormat.list === 'bullet');
          setIsOrderedList(currentFormat.list === 'ordered');
        }
      };
      editor.on('selection-change', handleSelectionChange);

      return () => {
        editor.off('selection-change', handleSelectionChange);
      };
    }
  }, [editorStore.quillRef]);

  useEffect(() => {
    if (editorStore.isEmpty) {
      setColor(Color.Gray[900]);
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsStrike(false);
      setIsBulletList(false);
      setIsOrderedList(false);
    }
  }, [editorStore.isEmpty]);

  return (
    <>
      <S.Wrapper className="custom-toolbar">
        <ToolbarButton
          icon={<b>가</b>}
          title={'굵게'}
          isActive={isBold}
          onClick={() => handleFormat('bold')}
        />
        <ToolbarButton
          icon={<i>가</i>}
          title={'기울임꼴'}
          isActive={isItalic}
          onClick={() => handleFormat('italic')}
        />
        <ToolbarButton
          icon={<u>가</u>}
          title={'밑줄'}
          isActive={isUnderline}
          onClick={() => handleFormat('underline')}
        />
        <ToolbarButton
          icon={<del>가</del>}
          title={'취소선'}
          isActive={isStrike}
          onClick={() => handleFormat('strike')}
        />
        <S.Divider />
        <ColorPicker
          onChange={(value: string) => handleColorChange(value)}
          color={color}
          editorStore={editorStore}
        />
        <HyperlinkInput
          onChange={(url: string, text: string, range: RangeStatic | null) =>
            addLink(url, text, range)
          }
          editorStore={editorStore}
        />
        <S.Divider />
        <ToolbarButton
          icon={<Icon.EditingParagraph3Line />}
          title={'순서가 지정된 목록'}
          isActive={isOrderedList}
          onClick={() => handleFormat('list', 'ordered')}
        />
        <ToolbarButton
          icon={<Icon.ViewListLine />}
          title={'글머리 기호 목록'}
          isActive={isBulletList}
          onClick={() => handleFormat('list', 'bullet')}
        />
      </S.Wrapper>
    </>
  );
});

export default EditorToolbar;
