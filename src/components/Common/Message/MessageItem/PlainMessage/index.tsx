import React from 'react';

import { isJsonString, unescapeHtml } from '@/utils';

import EditorMessage from '../EditorMessage';

import Emoji from './Emoji';
import Mention from './Mention';
import * as S from './styled';
import Text from './Text';

interface PlainMessageProps {
  msgId: number;
  content: string;
  getLink?: boolean;
  getMention?: boolean;
  getShort?: boolean;
  shortLines?: number;
  isMine?: boolean;
  allowKeywordSearch: boolean;
  ogUrl?: string;
  isEditor?: boolean;
  rawContent?: string;
}

const PlainMessage = (props: PlainMessageProps) => {
  const {
    msgId,
    content,
    getLink,
    getMention,
    getShort,
    shortLines = 1,
    isMine,
    allowKeywordSearch,
    ogUrl,
    isEditor,
    rawContent,
  } = props;

  if (isEditor) {
    return (
      <EditorMessage
        content={content}
        msgId={msgId}
        ogUrl={ogUrl}
        rawContent={rawContent}
      />
    );
  }
  const messages = content?.split(/[\n]/g) ?? [];

  return (
    <S.TextDiv isShort={getShort} shortLines={shortLines}>
      {messages?.map((message, index) => {
        const parsedMessage = message
          .split(/[<>]/g)
          .filter((item) => item !== null && item !== undefined)
          .map((item) => unescapeHtml(item));

        return (
          <S.TextParagraph key={`${msgId}_${index}`} isShort={getShort}>
            {parsedMessage?.map((message, index) => {
              const jsonObj = isJsonString(message);
              if (jsonObj?.type === 'mention') {
                return (
                  <Mention
                    key={index}
                    userName={jsonObj?.mentionName}
                    personaId={jsonObj?.mentionId}
                    getMention={getMention}
                    isMine={isMine}
                  />
                );
              } else if (jsonObj?.type === 'emoticon') {
                return (
                  <Emoji key={index} emoticonName={jsonObj?.emoticonName} />
                );
              }
              return (
                <Text
                  key={index}
                  content={message}
                  getLink={getLink}
                  isMine={isMine}
                  msgId={msgId}
                  allowKeywordSearch={allowKeywordSearch}
                  ogUrl={ogUrl}
                />
              );
            })}
          </S.TextParagraph>
        );
      })}
    </S.TextDiv>
  );
};

export default PlainMessage;
