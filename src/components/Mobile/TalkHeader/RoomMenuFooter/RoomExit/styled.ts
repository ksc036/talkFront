import { styled } from '@wapl/ui';

export const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 90px;
  gap: 8px;
  height: 20px;
  white-space: nowrap;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
`;
