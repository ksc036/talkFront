import { styled } from '@wapl/ui';

export const Wrapper = styled('div')<{ color: string }>`
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
`;

export const StyledImg = styled('img')``;
