import { styled } from '@wapl/ui';

export const MessageWrap = styled('div')`
  background: ${({ theme }) => theme.Color.Background[0]};
`;
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  background: ${({ theme }) => theme.Color.Background[0]};
  align-items: end;
  padding: 8px 16px 8px 16px;
  position: relative;
`;

export const AttachWrapper = styled('div')`
  height: 36px;
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

export const FooterWrapper = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.Color.Gray[100]};
  border: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding: 6px;
`;

export const InputWrapper = styled('div')`
  border-radius: 20px;
  margin-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
`;

export const MenuWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  margin-right: 8px;
  gap: 8px;
`;
