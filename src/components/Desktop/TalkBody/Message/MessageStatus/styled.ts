import { styled } from '@wapl/ui';

export const Wraaper = styled('div')``;

export const ButtonWraaper = styled.div<{ isHover: boolean }>`
  cursor: ${({ isHover }) => `${isHover ? 'pointer' : ''}`};
  background: ${({ isHover, theme }) =>
    `${isHover ? theme.Color.Black[4] : ''}`};
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

export const FailDiv = styled.div`
  display: flex;
`;

export const LoadingDiv = styled('div')``;
