import { styled } from '@wapl/ui';

export const AvatarWrapper = styled('div')<{ clickable: boolean }>`
  ${(props) => !props.clickable && 'pointer-events: none;'}
`;
