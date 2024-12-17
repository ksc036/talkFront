import { styled } from '@wapl/ui';

export const StickerImg = styled('img')<{ isReply?: boolean }>`
  max-width: 160px;
  height: 160px;
  opacity: ${({ isReply }) => (isReply ? '40%' : 'unset')};
  padding-bottom: 8px;
`;
