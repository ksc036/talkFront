import { styled } from '@wapl/ui';

export const messageWrap = styled('div')``;
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  background: ${({ theme }) => theme.Color.White[100]};
  align-items: end;
  padding: 0 20px;
  gap: 20px;
  position: relative;
`;

export const MenuWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  margin: 17px 0;
  gap: 8px;
  & > button {
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export const InputWrapper = styled('div')<{
  backgroundColor?: string;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid #eaeaea;
  border-radius: 20px;
  justify-content: space-between;
  margin: 12px 0 12px;
`;

export const MessageInputWrapper = styled.div<{ openToolbar?: boolean }>`
  display: flex;
  min-height: ${({ openToolbar }) => (openToolbar ? '120px' : '42px')};
  padding: 0 0 0 20px;
`;
