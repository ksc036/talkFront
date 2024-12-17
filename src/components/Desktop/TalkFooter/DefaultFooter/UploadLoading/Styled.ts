import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  position: absolute;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70px;
`;

export const Info = styled.div`
  padding-top: 16px;
`;
