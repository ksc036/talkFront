import { styled } from '@wapl/ui';

export const messageWrap = styled('div')`
  background: ${({ theme }) => theme.Color.Background[0]};
`;
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: end;
  border-top: 1px solid ${({ theme }) => theme.Color.Gray[200]};
`;

export const MenuWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  margin: 0px 20px 12px 20px;
  & > button {
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
  align-items: center;
`;

export const InputWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: 130px;
  border-radius: 20px;
  justify-content: space-between;
  padding: 0 20px 0 20px;
  cursor: text;
`;

export const LargeFooterFallback = styled.div`
  height: 175px;
  background: ${({ theme }) => theme.Color.White[100]};
`;
