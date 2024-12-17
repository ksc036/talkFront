import { styled } from '@wapl/ui';

export const SystemNewWrapper = styled('div')<{
  backgroundColor?: string;
  color?: string;
}>`
  padding: 12px 0;
`;

export const SystemNewText = styled('span')<{
  backgroundColor?: string;
  color?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 23px;
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
`;
