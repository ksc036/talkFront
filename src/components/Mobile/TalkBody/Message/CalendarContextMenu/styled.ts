import { ContextMenu, styled } from '@wapl/ui';

export const BottomContextMenu = styled(ContextMenu)<{
  height?: number;
  scaleDownRatio?: number;
}>`
  z-index: 1350;
  .MuiPaper-root {
    height: ${({ height }) => `${height}px`};
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: unset;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MuiPickersDay-root {
    font-family: 'Spoqa Han Sans Neo';
    ${({ theme }) => theme.Font.Text.xxxs.Regular};
    transform: ${({ scaleDownRatio }) => `scale(${scaleDownRatio})`};
  }

  #yearButton {
    margin-left: 9px;
  }

  .MuiIconButton-root:last-child {
    margin-right: 3px;
  }
`;
