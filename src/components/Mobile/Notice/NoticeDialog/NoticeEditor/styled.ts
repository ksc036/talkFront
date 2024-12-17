import ReactQuill from 'react-quill';

import { styled, Theme } from '@wapl/ui';

type TextColorProps = {
  color: string;
};

export const Wrapper = styled('div')`
  height: 100%;
`;

export const NoticeHeader = styled('div')`
  height: 56px;
`;

export const NoticeBody = styled('div')`
  height: calc(100% - 112px);
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const CustomReactQuill = styled(ReactQuill)<{ customTheme: Theme }>`
  height: 100%;
  border-radius: 12px;
  background: ${({ customTheme }) => customTheme.Color.Gray[100]};
  color: ${({ customTheme }) => customTheme.Color.Gray[900]};
  margin: 0 16px;

  .ql-container {
    height: 100% !important;
    border: none !important;
  }
  .ql-editor {
    font-family: 'Spoqa Han Sans Neo';
    ${({ customTheme }) => customTheme.Font.Text.l.Regular};
    padding: 12px;
    border-radius: 12px;
    border: 1px solid transparent;
    img {
      vertical-align: top;
    }
    &.ql-blank::before {
      font-style: normal;
    }
    &:focus {
      border: 1px solid ${({ customTheme }) => customTheme.Color.Gray[900]};
    }
  }
` as any;

export const TextLength = styled('div')`
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
