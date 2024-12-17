import { styled } from '@wapl/ui';

export const PickerItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60px;
`;

export const PickerValueWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  scroll-snap-align: start;
  color: ${({ theme }) => theme.Color.Gray[900]};
  border-radius: 8px;
  :hover {
    background: ${({ theme }) => theme.Color.Gray[100]};
  }
  &.selected {
    background: ${({ theme }) => theme.Color.Gray[100]};
  }
`;
