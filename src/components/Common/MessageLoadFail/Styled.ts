import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${(props) => props.color};
`;

export const FailBox = styled.div`
  width: 177px;
  height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const FailMessage = styled.div`
  text-align: center;
  margin-top: 8px;
  ${({ theme: { Font } }) => Font.Text.s.Regular};
`;

export const RetryButton = styled.button`
  background: none;
  border: 0;
  padding: 0;
  outline: 0;
`;
