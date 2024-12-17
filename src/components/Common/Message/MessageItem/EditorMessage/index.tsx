import React, { useCallback } from 'react';

import { useShell } from '@shell/sdk';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getAppUrl, getUrl, isAppUrl, isMobile, safeHttpsUrl } from '@/utils';
import { convertStyle, findText, sanitizeHTML } from '@/utils/editor';

import Mention from '../PlainMessage/Mention';

import * as S from './styled';

interface EditorMessageProps {
  content: string;
  msgId: number;
  ogUrl?: string;
  rawContent?: string;
}

interface EmoticonProps {
  src: string;
  alt: string;
  alias: string;
  width: string;
}

const EditorMessage = observer((props: EditorMessageProps) => {
  const { content, ogUrl, msgId, rawContent } = props;
  const { messageStore, configStore } = useStore();
  const shell = useShell();

  const handleClickUrl = (e: React.MouseEvent<HTMLElement>, url: string) => {
    e.preventDefault();
    const href = safeHttpsUrl(url);
    if (isAppUrl(href)) {
      const urlAppInfo = getAppUrl(href);
      const { appId, ...filteredUrlAppInfo } = urlAppInfo;
      shell.runApp({
        appId: `${appId}`,
        args: filteredUrlAppInfo,
      });
    } else if (isMobile()) {
      shell.mobile.deepLink.openNativeApp(href);
    } else {
      shell.openWindow(href);
    }
  };

  const Emoticon = ({ src, alt, alias, width }: EmoticonProps) => {
    return (
      <img
        className="emoticon"
        src={src}
        alt={alt}
        data-alias={alias}
        width={width}
        style={{ marginLeft: '4px', verticalAlign: 'top' }}
      />
    );
  };

  const renderContent = useCallback(
    (html: string) => {
      let htmlString = sanitizeHTML(html);

      // url 표시
      if (ogUrl) {
        const urls: string[] = [];
        rawContent?.split(/\s+/).map((item) => {
          if (getUrl(item)) urls.push(item);
        });
        htmlString = findText(htmlString, urls, 'url');
      }

      // 대화 내용 검색 표시
      if (!!messageStore.searchKeyword) {
        htmlString = findText(
          htmlString,
          [messageStore.searchKeyword],
          'highlight',
        );
      }
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const parseDomToReact = (
          node: Node,
          index: number,
        ): React.ReactNode => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;

            // 멘션
            if (element.classList.contains('mention')) {
              const userName = element.getAttribute('data-value') ?? '';
              const personaId = Number(element.getAttribute('data-id'));
              return (
                <span key={`mention-${index}`} className="mention">
                  <Mention
                    userName={userName}
                    personaId={personaId}
                    getMention={true}
                  />
                </span>
              );
            }

            // url
            if (
              element.tagName === 'SPAN' &&
              element.className.startsWith('url')
            ) {
              const className = element.className.split(' ');
              const url = className.length > 1 ? className[1] : '';
              return (
                <span
                  key={`url-${index}`}
                  className="url"
                  onClick={(e) => handleClickUrl(e, url)}
                >
                  {Array.from(element.childNodes).map((childNode, idx) =>
                    parseDomToReact(childNode, idx),
                  )}
                </span>
              );
            }

            // 하이퍼링크
            if (element.classList.contains('hyper-link')) {
              const url = element.getAttribute('url') ?? '';
              return (
                <span
                  key={`hyperlink-${index}`}
                  className="url"
                  onClick={(e) => handleClickUrl(e, url)}
                >
                  {Array.from(element.childNodes).map(parseDomToReact)}
                </span>
              );
            }

            // 이모티콘
            if (
              element.tagName === 'IMG' &&
              element.classList.contains('emoticon')
            ) {
              const src = element.getAttribute('src') || '';
              const alt = element.getAttribute('alt') || '';
              const alias = element.getAttribute('data-alias') || '';
              const width = element.getAttribute('width') || '20px';
              return (
                <Emoticon
                  key={`emoticon-${index}`}
                  src={src}
                  alt={alt}
                  alias={alias}
                  width={width}
                />
              );
            }

            // 대화 내용 검색
            if (
              element.tagName === 'SPAN' &&
              element.classList.contains('highlight')
            ) {
              return (
                <S.Highlight
                  key={`highlight-${index}`}
                  backgroundColor={
                    msgId ===
                    messageStore.searchResultIds[messageStore.searchIndex]
                      ? configStore.HighlightedFocusedMessageColor
                      : configStore.HighlightedOtherMessageColor
                  }
                  color={configStore.HighlightedTextColor}
                >
                  {Array.from(element.childNodes).map(parseDomToReact)}
                </S.Highlight>
              );
            }

            const props: any = {};
            if (element?.className) props.className = element.className;
            if (element?.style) props.style = convertStyle(element.style);

            const children = Array.from(element.childNodes).map(
              parseDomToReact,
            );

            return React.createElement(
              element.tagName.toLowerCase(),
              { ...props, key: `${element.innerHTML}-${index}` },
              children,
            );
          }
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
          }

          return null;
        };
        return Array.from(doc.body.childNodes).map((childNode, idx) =>
          parseDomToReact(childNode, idx),
        );
      } catch (error) {
        console.log('Error parsing content:', error);
        return <></>;
      }
    },
    [content, messageStore.searchKeyword, messageStore.searchIndex],
  );

  const showContent = renderContent(content);
  return <S.TextBox className="ql-editor">{showContent}</S.TextBox>;
});

export default EditorMessage;
