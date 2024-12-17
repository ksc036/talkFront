import { styled, css } from '@wapl/ui';

export const Message = styled('span')<{ isMine?: boolean }>`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme, isMine }) =>
    isMine ? theme.Color.White[100] : theme.Color.Gray[900]};
  margin: 0;
  padding: 0;
`;

export const MentionText = styled('span')`
  ${({ theme }) => theme.Font.Text.m.Bold};
  color: ${({ color }) => color};
  cursor: pointer;
`;

export const UrlWrapper = styled('a')`
  color: ${({ color }) => color};
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const TextWrapper = styled('span')`
  word-break: break-word;
`;

export const TextDiv = styled('div')<{ isShort?: boolean; shortLines: number }>`
  ${({ isShort }) =>
    isShort &&
    css`
      display: -webkit-box;
      white-space: nowrap;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  -webkit-line-clamp: ${({ isShort, shortLines }) => isShort && shortLines}
`;

export const TextParagraph = styled('p')<{ isShort?: boolean }>`
  margin: 0;
  white-space: break-spaces;
  ${({ isShort }) =>
    isShort &&
    css`
      display: inline;
    `}
`;
