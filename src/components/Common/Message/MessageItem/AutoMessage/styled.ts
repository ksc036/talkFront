import { styled } from '@wapl/ui';

export const AutoMsgWrapper = styled('div')`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AutoMsgText = styled('span')<{
  backgroundColor?: string;
  color?: string;
}>`
  width: fit-content;
  max-width: 70%;
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  border-radius: 12px;
  padding: 5px 18px;
`;
