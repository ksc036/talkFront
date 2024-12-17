import { Icon, styled } from '@wapl/ui';

export const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.Color.Gray[200]};
`;

export const LocationIconWrapper = styled('div')``;

export const ChatColor = styled(Icon.ChatColor)<{ fill: string }>`
  path {
    fill: ${({ fill }) => fill};
  }
`;
