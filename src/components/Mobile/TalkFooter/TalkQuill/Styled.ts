import { styled } from '@wapl/ui';

export const Wrapper = styled.div<{ mentionColor: string }>`
  position: relative;
  .ql-editor {
    font-family: 'Spoqa Han Sans Neo';
    position: relative;
    max-height: 130px;
    overflow: auto;
    padding: 0;
    &::-webkit-scrollbar {
      width: 4px;
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.Color.Gray[400]};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.Color.Gray[100]};
    }
  }

  .ql-editor div {
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    word-break: normal;
    overflow-wrap: anywhere;
  }
  .quill > .ql-container > .ql-editor.ql-blank::before {
    left: 0;
    right: 20px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    color: ${({ theme }) => theme.Color.Gray[400]};
    font-style: normal;
  }
  width: 100%;

  .ql-container {
    position: static;
    list-style: none;
  }

  .ql-mention-list {
    padding: 0px 8px;
  }

  .ql-mention-list-container {
    left: -19px !important;
    height: 180px;
    border-radius: 12px 12px 0 0;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.Color.White[100]};
    width: ${window.innerWidth}px !important;
  }

  .ql-mention-list-box {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .ql-mention-list-item {
    height: 52px;
    font-family: 'Spoqa Han Sans Neo';
    list-style: none;
    padding: 8px 12px;
  }

  .ql-mention-list-item.selected {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }

  .ql-mention-list-item:hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }

  .ql-mention-list-img {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    border-radius: 50%;
  }

  .ql-mention-list-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-family: 'Spoqa Han Sans Neo';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
  }

  .mention {
    background-color: transparent;
  }

  .mention span {
    font-weight: 600;
    color: ${({ mentionColor, theme }) =>
      mentionColor ?? theme.Color.Blue[500]};
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
  }
`;
