import React, { ReactNode } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';
import { isMobile, parseNewLine } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';

import PlainMessage from '../PlainMessage';

import * as S from './styled';
interface MetaTagMessageProps {
  notiText: string;
  onClick?: () => void;
  isReply?: boolean;
  title?: string;
  titleLimit?: number; // 제목 최대 몇줄까지 보일지 제한, 없으면 제한 없음
  msgId: number;
  content?: ReactNode;
  hasBottom: boolean;
  bottomText?: string;
  bottomIcon?: ReactNode;
  minHeight?: number;
}

const MetaTagMessage = (props: MetaTagMessageProps) => {
  const {
    notiText,
    onClick,
    isReply,
    title,
    titleLimit,
    msgId,
    content,
    hasBottom,
    bottomText,
    bottomIcon,
    minHeight,
  } = props;
  const { configStore } = useStore();
  const { Color } = useTheme();
  return (
    <S.NotiWrapper isReply={isReply} minHeight={minHeight}>
      <S.NotiBody
        hasBottom={hasBottom}
        color={isDarkMode() ? '#3C4043' : 'white'}
        isMobile={isMobile()}
      >
        <S.NotiInfoText color={configStore.MessageTitleColor}>
          {notiText}
        </S.NotiInfoText>
        {title && (
          <S.NotiTitleText>
            <PlainMessage
              content={parseNewLine(title)}
              msgId={msgId}
              getShort={!isNaN(titleLimit as number)}
              shortLines={titleLimit}
              getLink={false}
              getMention={false}
              allowKeywordSearch={!isReply}
            />
          </S.NotiTitleText>
        )}
        {content}
      </S.NotiBody>
      {hasBottom && (
        <S.NotiBottom
          color={isDarkMode() ? '#5F6368' : Color.Gray[50]}
          isMobile={isMobile()}
          onClick={onClick}
        >
          {bottomIcon}
          <S.NotiBottomText>{bottomText}</S.NotiBottomText>
          <Icon.ArrowFrontLine width={16} height={16} color={Color.Gray[400]} />
          <S.Overlay isMobile={isMobile()} isReply={isReply} />
        </S.NotiBottom>
      )}
    </S.NotiWrapper>
  );
};

export default MetaTagMessage;
