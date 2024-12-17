import { styled } from '@wapl/ui';

export const EmoticonTabWrapper = styled('div')<{ emoticonPerPage: number }>`
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: ${({ emoticonPerPage }) =>
    `repeat(${emoticonPerPage} , 1fr)`};
`;

export const prevEmoticonsButton = styled('div')`
  padding-right: 8px;
  & > svg {
    path {
      fill: ${({ theme: { Color } }) => Color.Gray[500]};
    }
  }
`;

export const nextEmoticonsButton = styled('div')`
  padding-left: 8px;
  & > svg {
    path {
      fill: ${({ theme: { Color } }) => Color.Gray[500]};
    }
  }
  margin-left: auto;
`;

export const emptyEmoticon = styled('div')``;
