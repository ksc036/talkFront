import { styled } from '@wapl/ui';

export const Wrapper = styled.div<{ openToolbar: boolean }>`
  position: relative;
  .quill {
    padding: 10px 0 10px;
  }

  .ql-editor {
    font-family: 'Spoqa Han Sans Neo';
    position: relative;
    max-height: ${({ openToolbar }) => (openToolbar ? '232px' : '130px')};
    user-select: text;
    overflow: auto;
    padding: 0;
    &::-webkit-scrollbar {
      width: 4px;
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
    line-height: 22px;
    font-weight: 400;
    word-break: normal;
    overflow-wrap: anywhere;
  }
  .quill > .ql-container > .ql-editor.ql-blank::before {
    left: 0;
    right: 20px;
    font-size: 14px;
    line-height: 22px;
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
    width: 90% !important;
    max-width: 344px;
    min-width: 284px;
    right: auto !important;
    height: 298px;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    transform: translateY(-20px);
    background-color: ${({ theme }) => theme.Color.White[100]};
  }

  .ql-mention-list-box {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .ql-mention-list-item {
    width: 100%;
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
    color: ${({ theme }) => theme.Color.Blue[500]};
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    font-style: normal;
    text-decoration: none;
    display: inline-block;
  }

  .hyper-link span {
    font-style: normal;
    text-decoration: underline;
    display: inline-block;
    color: ${({ theme }) => theme.Color.Blue[500]};
    :hover {
      cursor: pointer;
    }
  }

  .ql-tooltip {
    display: none;
  }
`;
