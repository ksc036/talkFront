import { styled } from '@wapl/ui';

export const LinkDrawerHeader = styled.div`
  width: 100%;
  height: 72px;
  display: grid;
  grid-template-columns: 1fr fit-content(100%) fit-content(100%);
  align-items: center;
  gap: 20px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
`;

export const LinkDrawerHeaderTitle = styled.p`
  ${({ theme: { Font } }) => Font.Text.xl.Medium};
  color: ${({ theme }) => theme.Color.Gray[900]};
  white-space: nowrap;
  margin-right: 20px;
`;
