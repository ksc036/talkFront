import { RefObject } from 'react';
import ReactQuill from 'react-quill';

/**
 * quill에 작성된 메시지가 에디터 메시지인지 확인하는 함수
 * @param quillRef
 * @returns {boolean} 에디터 메시지면 true
 */
export const isFormattedMessage = (quillRef: RefObject<ReactQuill> | null) => {
  const editor = quillRef?.current?.getEditor();
  if (editor) {
    const delta = editor.getContents();
    const hasFormat = delta.ops?.some((op) => {
      if (!!op.attributes) {
        if (op.insert?.img && op.attributes.class === 'emoticon') return false;
        if (op.insert?.span && op.attributes.class === 'mention') return false;
        return true;
      }
    });
    return hasFormat;
  }
};

const allowedTags = [
  'div',
  'strong',
  'em',
  'u',
  's',
  'span',
  'ul',
  'ol',
  'li',
  'img',
];
const allowedStyles = [
  'color',
  'background-color',
  'text-decoration',
  'margin-right',
];
const allowedClasses = ['mention', 'emoticon', 'hyper-link'];
const allowedAttributes = [
  'class',
  'alt',
  'data-src',
  'src',
  'data-alias',
  'width',
  'style',
  'data-denotation-char',
  'data-index',
  'data-id',
  'data-value',
  'url',
  'target',
];

/**
 * xss 공격 대비 살균 함수
 * @param {string} html 살균할 html 문자열
 * @returns {string} 허용한 태그와 스타일만 가지고 있는 html 문자열
 */
export function sanitizeHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const elements = doc.body.querySelectorAll('*');

  elements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    if (!allowedTags.includes(tagName)) {
      const parent = el?.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
      }
      el.remove();
      return;
    }
    if (el.hasAttribute('style')) {
      const styleValue = el.getAttribute('style') as string;
      const styleRules = styleValue
        .split(';')
        .map((rule) => rule.trim())
        .filter((rule) => {
          const [property] = rule.split(':').map((r) => r.trim());
          return allowedStyles.includes(property);
        })
        .join('; ');

      if (styleRules) {
        el.setAttribute('style', styleRules);
      } else {
        el.removeAttribute('style');
      }
    }
    Array.from(el.attributes).forEach((attr) => {
      if (!allowedAttributes.includes(attr.name)) {
        el.removeAttribute(attr.name);
      } else if (
        attr.name === 'class' &&
        !allowedClasses.includes(attr.value)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  const sanitizedContent = doc.body?.innerHTML || '';

  return sanitizedContent;
}

/**
 * html문자열에서 특정 텍스트 찾아서 일치하는 부분 span으로 감싸고 클래스 이름 부여하는 함수
 * @param {string} html 전체 html 문자열
 * @param {string[]} search 검색할 텍스트들이 들어있는 배열
 * @param {string} className span 태그에 부여할 클래스 이름
 * @returns {string} 검색 결과 html 문자열
 */
export function findText(
  html: string,
  search: string[],
  className: string,
): string {
  const tagRegex = /(<[^>]+>)|([^<]+)/g;
  const keywordRegex = new RegExp(search.join('|'), 'gi');
  let textOnly = '';
  const fragments: { type: 'tag' | 'text'; value: string }[] = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [fullMatch, tag, text] = match;
    if (tag) {
      fragments.push({ type: 'tag', value: tag });
    } else if (text) {
      textOnly += text;
      fragments.push({ type: 'text', value: text });
    }
  }

  const highlightedRanges: Array<{ start: number; end: number }> = [];
  let keywordMatch;

  while ((keywordMatch = keywordRegex.exec(textOnly)) !== null) {
    const start = keywordMatch.index;
    const end = start + keywordMatch[0].length;
    highlightedRanges.push({ start, end });
  }

  let resultHtml = '';
  let currentOffset = 0;

  for (const fragment of fragments) {
    if (fragment.type === 'tag') {
      resultHtml += fragment.value;
    } else if (fragment.type === 'text') {
      let fragmentText = '';
      let lastIndex = 0;
      const fragmentLength = fragment.value.length;

      highlightedRanges.forEach(({ start, end }) => {
        if (start >= currentOffset + fragmentLength || end <= currentOffset) {
          return;
        }
        const localStart = Math.max(start - currentOffset, 0);
        const localEnd = Math.min(end - currentOffset, fragmentLength);

        if (lastIndex < localStart) {
          fragmentText += fragment.value.slice(lastIndex, localStart);
        }

        fragmentText += `<span class="${className}">${fragment.value.slice(
          localStart,
          localEnd,
        )}</span>`;

        lastIndex = localEnd;
      });

      if (lastIndex < fragment.value.length) {
        fragmentText += fragment.value.slice(lastIndex);
      }
      resultHtml += fragmentText;
      currentOffset += fragmentLength;
    }
  }
  return resultHtml;
}

/**
 * DOM 요소의 스타일 정보를 React에서 사용 가능하도록 변환하는 함수
 * @param {CSSStyleDeclaration} style DOM 요소의 스타일
 * @returns {React.CSSProperties} 스타일 객체
 */
export const convertStyle = (
  style: CSSStyleDeclaration,
): React.CSSProperties => {
  const convertedStyle: React.CSSProperties = {};
  for (let i = 0; i < style.length; i++) {
    const key = style.item(i);
    const cssValue = style.getPropertyValue(key);
    (convertedStyle as any)[key] = cssValue;
  }

  return convertedStyle;
};

export function getHTMLStringText(html: string): string {
  const tagRegex = /(<[^>]+>)|([^<]+)/g;
  let resultText = '';
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [fullMatch, tag, text] = match;

    if (tag) {
      const emoticonRegex = /<img.*class=["'].*emoticon.*["'][^>]*>/i;

      if (emoticonRegex.test(tag)) {
        resultText += '이모티콘';
      }
    } else if (text) {
      resultText += text;
    }
  }
  return resultText.trim();
}
