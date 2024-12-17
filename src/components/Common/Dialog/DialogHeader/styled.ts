import { styled } from '@wapl/ui';

interface WrapperProps {
  backgroundColor?: string;
}

interface IconWrapperProps {
  enableCursor: boolean;
  hasMarginRight: boolean;
}

export const CommonDialogHeaderWrapper = styled('div')<WrapperProps>`
  width: 100%;
  height: 56px;
  display: flex;

  :nth-of-type(1) {
    margin-bottom: ${({ backgroundColor }) =>
      backgroundColor !== '' ? '20px' : '10px'};
  }

  :nth-of-type(1) > :nth-of-type(1) {
    width: 100%;
    background-color: ${({ backgroundColor }) => backgroundColor};
    height: ${({ backgroundColor }) => (backgroundColor ? '56px' : '72px')};
    display: flex;
    color: white;
  }

  :nth-of-type(1) > :nth-of-type(1) > :nth-of-type(1) > svg,
  :nth-of-type(1) > :nth-of-type(1) > :nth-of-type(1) > :nth-of-type(1) > svg {
    filter: ${({ backgroundColor }) =>
      backgroundColor !== '' && 'brightness(100)'};
  }

  :nth-of-type(1) > :nth-of-type(1) > h2 {
    ${({ theme: { Font } }) => Font.Text.l.Bold};
    color: ${({ backgroundColor }) => backgroundColor && 'white'};
  }

  :nth-of-type(1) > :nth-of-type(1) > button > svg {
    filter: ${({ backgroundColor }) =>
      backgroundColor !== '' && 'brightness(100)'};
  }
`;

export const IconsWrapper = styled('div')<IconWrapperProps>`
  display: flex;
  flex-direction: row;
  cursor: ${({ enableCursor }) => (enableCursor ? 'pointer' : 'default')};
  margin-right: ${({ hasMarginRight }) => hasMarginRight && '10px'};
`;
