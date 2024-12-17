import { styled } from '@wapl/ui';

export const SearchArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 44px;
  background: ${({ theme }) => theme.Color.Background[0]};
`;

export const IconBtn = styled('button')`
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 0;
  background: none;
  flex-shrink: 0;
  margin-left: 4px;
  & + & {
    margin-left: 0;
  }
  & > svg {
    flex-shrink: 0;
  }
  &:disabled {
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[400]};
      }
    }
  }
  &:hover:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[4]};
  }
  &:active:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[6]};
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[900]};
      }
    }
  }
`;
