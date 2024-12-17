import { styled } from '@wapl/ui';

export const TextBox = styled.div`
  .mention span {
    display: inline-block;
    font-style: normal;
    text-decoration: none;
    font-weight: 600;
  }
  .hyper-link span {
    display: inline-block;
    text-decoration: underline;
    font-weight: 600;
    color: ${({ theme }) => theme.Color.Blue[500]};
    cursor: pointer;
  }
  span.url {
    display: inline-block;
    text-decoration: underline;
    color: ${({ theme }) => theme.Color.Blue[500]};
    cursor: pointer;
  }
`;

export const Highlight = styled.span<{
  backgroundColor: string;
  color: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-weight: 500;
`;
