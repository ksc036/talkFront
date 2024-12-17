import { styled } from '@wapl/ui';

export const Wrapper = styled('div')<{ isReply?: boolean; height: number }>`
  height: ${({ height }) => `${height}px`};
  overflow: hidden;
`;

export const GridWrapper = styled('div')<{
  isTempMessage: boolean;
  isMobile: boolean;
  isMini: boolean;
  rows: number;
}>`
  display: grid;
  row-gap: 4px;
  column-gap: 4px;
  overflow: hidden;
  width: ${({ isMobile, isMini }) =>
    isMobile ? '240px' : isMini ? `${(3 / 4) * 360}px` : '360px'};
  opacity: ${({ isTempMessage }) => (isTempMessage ? '50%' : 'none')};
  grid-template-columns: repeat(6, 1fr);
  ${({ rows, isMobile, isMini }) => {
    let styles = '';
    for (let i = 0; i <= rows * 3; i++) {
      styles += `
        & > :nth-of-type(${i}) {
          grid-column: span 2;
          height: ${isMobile ? '72px' : isMini ? `${(3 / 4) * 88}px` : '88px'};
        }
      `;
    }
    return styles;
  }}

  ${({ rows, isMobile, isMini }) => `
    & > :nth-of-type(n + ${rows * 3 + 1}) {
      grid-column: span 3;
      height: ${isMobile ? '100px' : isMini ? `${(3 / 4) * 134}px` : '134px'};
    }
  `}
`;

export const ItemWrapper = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

export const Item = styled('img')<{ isTempMessage?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  background-size: cover;
  object-fit: cover;
  cursor: ${({ isTempMessage }) => (isTempMessage ? 'default' : 'pointer')};

  &:hover {
    opacity: ${({ isTempMessage }) => (isTempMessage ? 1 : 0.65)};
  }
`;

export const ItemPlaceholder = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  background-color: ${({ theme }) => theme.Color.Gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InvalidImageWrapper = styled('div')<{
  width: number;
  height: number;
}>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

export const SingleItem = styled('img')<{
  isTempMessage: boolean;
  isMobile: boolean;
  isMini: boolean;
}>`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  width: ${({ isMobile, isMini }) =>
    isMobile ? '240px' : isMini ? `${(3 / 4) * 360}px` : '360px'};
  height: ${({ isMobile, isMini }) =>
    isMobile ? '170px' : isMini ? `${(3 / 4) * 270}px` : '270px'};
  opacity: ${({ isTempMessage }) => (isTempMessage ? '50%' : 'none')};
  object-fit: cover;
  cursor: ${({ isTempMessage }) => (isTempMessage ? 'default' : 'pointer')};

  &:hover {
    opacity: ${({ isTempMessage }) => (isTempMessage ? 1 : 0.65)};
  }
`;
