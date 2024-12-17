import { styled } from '@wapl/ui';

export const ColorPickerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  padding: 10px 15px;
  grid-template-columns: repeat(5, minmax(auto, 1fr));
  grid-template-rows: repeat(2, minmax(auto, 1fr));
  align-items: center;
  justify-items: center;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const ColorPicker = styled.div<{ color?: string }>`
  background-color: ${({ color }) => color};
  width: 24px;
  height: 24px;
  border-radius: 100%;
  cursor: pointer;
`;
