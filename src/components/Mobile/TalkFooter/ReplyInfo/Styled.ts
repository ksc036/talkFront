import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 88px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  border-top: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

export const CloseButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: 0;
  padding: 0;
`;
