import { styled } from '@wapl/ui';

export const TimePickerContainer = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'height',
})<{
  height: number;
}>`
  display: flex;
  height: ${({ height }) => `${height}px`};
  padding: 16px;
  background-color: ${({ theme }) => theme.Color.Background[2]};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  scrollbar-width: none;

  div {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
