import { styled } from '@wapl/ui';

export const MenuWrapper = styled('div')<{ backgroundColor?: string }>`
  height: 32px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 12px;
`;
