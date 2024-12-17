import React, { MouseEvent } from 'react';
import Highlighter from 'react-highlight-words';

import { useShell } from '@shell/sdk';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import { getAppUrl, getUrl, isAppUrl, isMobile, safeHttpsUrl } from '@/utils';

import * as S from './styled';

interface TextProps {
  content: string;
  getLink?: boolean;
  isMine?: boolean;
  msgId?: number;
  allowKeywordSearch: boolean;
  ogUrl?: string;
}

const Text = observer((props: TextProps) => {
  const {
    content,
    getLink = true,
    isMine,
    msgId,
    allowKeywordSearch,
    ogUrl,
  } = props;
  const shell = useShell();
  const { messageStore, configStore } = useStore();

  const handleClickUrl = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const href = safeHttpsUrl(getUrl(content));
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

  if (messageStore.getSearchKeyword()) {
    if (getUrl(content) && getLink) {
      const href =
        content.substring(0, 8) === 'https://' ||
        content.substring(0, 7) === 'http://'
          ? content
          : `https://${content}`;
      return (
        <S.UrlWrapper
          href={href}
          onClick={handleClickUrl}
          target="_blank"
          color={
            isMine
              ? configStore.MyMessageStyle.LinkColor
              : configStore.OtherMessageStyle.LinkColor
          }
        >
          <Highlighter
            autoEscape
            highlightClassName="highlight-search changedColor"
            searchWords={
              allowKeywordSearch ? [messageStore.getSearchKeyword()] : []
            }
            textToHighlight={content || ''}
            highlightStyle={{
              background:
                msgId === messageStore.searchResultIds[messageStore.searchIndex]
                  ? configStore.HighlightedFocusedMessageColor
                  : configStore.HighlightedOtherMessageColor,
              color: configStore.HighlightedTextColor,
              fontWeight: 500,
            }}
          />
        </S.UrlWrapper>
      );
    }
    return (
      <S.TextWrapper>
        <Highlighter
          autoEscape
          highlightClassName="highlight-search changedColor"
          searchWords={
            allowKeywordSearch ? [messageStore.getSearchKeyword()] : []
          }
          textToHighlight={content || ''}
          highlightStyle={{
            background:
              msgId === messageStore.searchResultIds[messageStore.searchIndex]
                ? configStore.HighlightedFocusedMessageColor
                : configStore.HighlightedOtherMessageColor,
            color: configStore.HighlightedTextColor,
            fontWeight: 500,
          }}
        />
      </S.TextWrapper>
    );
  }

  return (
    <S.TextWrapper>
      {content.split(' ').map((item, index, arr) => {
        if (getUrl(item) && getLink) {
          const href =
            item.substring(0, 8) === 'https://' ||
            item.substring(0, 7) === 'http://'
              ? item
              : `https://${item}`;
          return (
            <S.UrlWrapper
              key={index}
              href={href}
              onClick={handleClickUrl}
              target="_blank"
              color={
                isMine
                  ? configStore.MyMessageStyle.LinkColor
                  : configStore.OtherMessageStyle.LinkColor
              }
            >
              {item}
            </S.UrlWrapper>
          );
        }
        if (index === arr.length - 1 && item !== '') {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        }
        return <React.Fragment key={index}>{item} </React.Fragment>;
      })}
    </S.TextWrapper>
  );
});

export default Text;
