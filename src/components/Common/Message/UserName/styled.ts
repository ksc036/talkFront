import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-bottom: 4px;
`;
