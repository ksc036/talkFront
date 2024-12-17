import { RefObject } from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';

import { action, computed, makeObservable, observable } from 'mobx';

import { MentionProps } from '@/@types';
import {
  parseEmoticon,
  parseMention,
  getUrl,
  parseAngleBracket,
  parseHyperLink,
} from '@/utils';
import { mergeObject } from '@/utils/mobx';

import type { DeltaOperation, Sources } from 'quill';

export class EditorStore {
  quillRef: RefObject<ReactQuill> | null;
  content: string;
  delta: { ops: [] };
  isEmpty: boolean;
  textLength: number;

  constructor() {
    this.quillRef = null;
    this.content = '';
    this.delta = { ops: [] };
    this.isEmpty = true;
    this.textLength = 0;
    makeObservable(this, {
      quill: computed,
      isEmpty: observable,
      setQuillRef: action,
      update: action,
      clear: action,
      textLength: observable,
      content: observable,
    });
  }

  get quill(): any {
    return this.quillRef?.current?.getEditor();
  }

  setQuillRef(quillRef: RefObject<ReactQuill>): void {
    this.quillRef = quillRef;
  }

  setContent(content: string): void {
    this.content = content;
  }

  update(content: string, quill: UnprivilegedEditor): void {
    const delta = quill.getContents();

    mergeObject(this, {
      content,
      delta,
      isEmpty: quill.getText().trim().length === 0 && delta?.ops?.length === 1,
      textLength: delta.length() - 1,
    });
  }

  clear(): void {
    this.quill?.deleteText(0, this.quill.getLength());

    mergeObject(this, {
      content: '',
      delta: { ops: [] },
      isEmpty: true,
      selection: { index: 0, length: 0 },
      textLength: 0,
    });
  }

  focus(): void {
    if (this.quill) {
      this.quill.focus();
    }
  }

  blur(): void {
    if (this.quill) {
      this.quill.blur();
    }
  }

  setCursor(index = this.textLength, length = 0): void {
    if (this.quill) {
      this.focus();
      this.quill.setSelection(index, length);
    }
  }

  setCursorEnd(): void {
    if (this.quill) {
      this.focus();
      this.quill.setSelection(this.quill.getLength() - 1, 0);
    }
  }

  deleteText(length: number, selection: number): void {
    if (this.quill) {
      this.quill.deleteText(length, selection);
    }
  }

  getText(): string {
    if (this.quill) {
      return this.quill
        .getContents()
        .filter(
          ({ insert }: any) => typeof insert === 'string' || insert.emoticon,
        )
        .map(({ insert }: any) => (insert.emoticon ? 'e' : insert))
        .join('');
    }
    return '';
  }

  changePlaceholder(text: string): void {
    if (this.quill) {
      this.quill.root.dataset.placeholder = text;
    }
  }

  insertEmbed(
    index: number,
    type: string,
    value: unknown,
    source: Sources = 'user',
  ): void {
    if (this.quill) {
      this.quill.insertEmbed(index, type, value, source);
    }
  }

  insertText(index: number, text: string, source: Sources = 'user'): void {
    if (this.quill) {
      this.quill.insertText(index, text, source);
    }
  }

  getParsed() {
    if (this.quill) {
      const mentions: MentionProps[] = [];
      const content = this.quill.getContents();
      let parsedText: string = content
        .filter(
          ({ insert }: DeltaOperation['insert']) =>
            typeof insert === 'string' ||
            insert.emoticon ||
            insert.mention ||
            insert.hyperLink,
        )
        .map(({ insert }: DeltaOperation['insert']) => {
          if (insert.emoticon) return parseEmoticon(insert.emoticon.colons);
          else if (insert.mention) {
            mentions.push({
              mentionId: insert.mention.id,
              mentionName: insert.mention.value,
            });
            return parseMention(insert.mention.id, insert.mention.value);
          } else if (insert.hyperLink)
            return parseHyperLink(insert.hyperLink.url, insert.hyperLink.text);
          return parseAngleBracket(insert);
        })
        .join('')
        .replace(/\n(?=\s*$)/, '');
      if (!parsedText.replace(/\n/g, '').trim()) parsedText = '';
      return { parsedText, mentions };
    }
    return {};
  }

  getRawText(): string {
    if (this.quill) {
      const content = this.quill.getContents();
      const rawText = content
        .filter(
          ({ insert }: DeltaOperation['insert']) =>
            typeof insert === 'string' || insert.mention || insert.hyperLink,
        )
        .map(({ insert }: DeltaOperation['insert']) => {
          if (insert.mention) return insert.mention.value;
          if (insert.hyperLink) return insert.hyperLink.text;
          return insert;
        })
        .join('')
        .replace(/\n(?=\s*$)/, '');
      if (!rawText.replace(/\n/g, '').trim()) return '';
      return rawText;
    }
    return '';
  }

  parseContent() {
    if (this.quill) {
      const { parsedText, mentions } = this.getParsed();
      const rawText = this.getRawText();
      const ogUrl = getUrl(rawText);
      return {
        parsedText: parsedText,
        rawText: rawText,
        ogUrl: ogUrl,
        mention: mentions,
      };
    }
    return {};
  }

  getSelection() {
    return this.quill?.getSelection(true);
  }
}
