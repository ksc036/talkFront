import ReactQuill from 'react-quill';

import { styled, Mui, DialogHeader, DialogContent, Theme } from '@wapl/ui';

type TextColorProps = {
  color: string;
};

export const Header = styled(DialogHeader)`` as any;

export const Content = styled(DialogContent)`
  height: 100%;
  margin-bottom: 0px;
`;

export const CustomReactQuill = styled(ReactQuill)<{ customTheme: Theme }>`
  height: 100%;
  background: ${({ customTheme }) => customTheme.Color.Gray[100]};
  color: ${({ customTheme }) => customTheme.Color.Gray[900]};
  border-radius: 12px;
  .ql-container {
    height: 100% !important;
    border: none !important;

    & ::-webkit-scrollbar {
      width: 12px;
      background-color: transparent;
    }

    & ::-webkit-scrollbar-track,
    & ::-webkit-scrollbar-track-piece {
      background-color: transparent;
    }

    & ::-webkit-scrollbar-thumb {
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 12px;
      opacity: 1;
      background-color: ${({ customTheme }) => customTheme.Color.Gray[400]};
    }
  }
  .ql-editor {
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid transparent;
    img {
      vertical-align: top;
    }
    &:focus {
      border: 1px solid ${({ customTheme }) => customTheme.Color.Gray[900]};
    }
    &.ql-blank::before {
      font-style: normal;
    }
  }
` as any;

export const TextLength = styled('span')`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  width: 100%;
  text-align: right;
  padding: 0px 20px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const TextLengthCurrent = styled('span')<TextColorProps>`
  color: ${({ color }) => color};
`;

export const TextLengthTotal = styled('span')<TextColorProps>`
  color: ${({ color }) => color};
`;

export const IconButton = styled(Mui.IconButton)`
  width: 24px;
  height: 24px;
  padding: 0px;
  &:hover {
    background: ${({ theme }) => theme.Color.Black[6]};
  }
`;

export const Footer = styled('div')`
  display: flex;
  gap: 12px;
  padding: 0 20px 20px 20px;
  button {
    flex: 1;
  }
`;
