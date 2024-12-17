import { styled } from '@wapl/ui';

export const TalkLayout = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.Color.Gray[200]};
  overflow: hidden;
`;
