import { styled } from '@wapl/ui';

export const ReplyButton = styled('button')`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: unset;
  &:hover {
    background: #0000000a;
  }
  &:active,
  &:focus {
    background: #0000000f;
    & > svg > path {
      fill: #202124;
    }
  }
`;
