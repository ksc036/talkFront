import { styled } from '@wapl/ui';

export const RoomListWrapper = styled('div')`
  height: 100%;
  overflow: hidden;

  section > div > p {
    color: transparent;
  }

  section > header:nth-of-type(1) > div:nth-of-type(1) > h2 {
    ${({ theme }) => theme.Font.Text.xl.Medium};
  }
`;
