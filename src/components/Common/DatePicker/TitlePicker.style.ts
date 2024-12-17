import { styled } from '@wapl/ui';

export const PickerContainer = styled.div<{ width: number }>`
  display: flex;
  width: ${({ width }) => `${width}px`};
  height: 200px;
  margin-top: 20px;
  padding: 16px;
  position: absolute;
  z-index: 1;
  background-color: ${({ theme: { Color } }) => Color.White[100]};
  box-shadow: 0px 0px 8px ${({ theme: { Color } }) => Color.Black[20]};
  border-radius: 12px;
`;

export const PickerItemContainer = styled.div`
  width: 100%;
  position: relative;
  flex-direction: column;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

export const PickerValueWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  scroll-snap-align: start;
  border-radius: 8px;
  :hover {
    background: ${({ theme: { Color } }) => Color.Black[4]};
  }
`;
