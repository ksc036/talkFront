import { styled } from '@wapl/ui';

export const Wrapper = styled.div<{ count: number }>`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${(props) =>
    props.count >= 5000
      ? props.theme.Color.Blue[500]
      : props.theme.Color.Gray[900]};
  margin-left: auto;
`;
