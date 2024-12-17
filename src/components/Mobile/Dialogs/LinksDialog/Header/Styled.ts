import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 12px;
`;

export const Title = styled.p`
  display: flex;
  flex: 1;
  padding-left: 12px;
  ${({ theme: { Font } }) => Font.Text.xl.Medium};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;
