import React from 'react';

import { EmoticonModel } from '@/models';

import * as S from './styled';

interface StickerMessageProps {
  sticker: string;
  isReply?: boolean;
}

const StickerMessage = (props: StickerMessageProps) => {
  const { sticker, isReply = false } = props;
  const stickerSrc = EmoticonModel.getEmoticon(sticker);
  return <S.StickerImg src={stickerSrc?.image} isReply={isReply} />;
};

export default StickerMessage;
