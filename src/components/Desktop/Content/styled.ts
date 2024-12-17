import { styled } from '@wapl/ui';

export const ContentWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex: 1;
  position: relative;
  overflow-y: auto;
`;

export const IconWrap = styled('div')`
  width: 24px;
  height: 24px;
  align-self: center;
  margin-right: 8px;
`;

export const DNDBox = styled('div')<{ isDragging: boolean }>`
  box-sizing: border-box;
  border: ${(props) =>
    props.isDragging ? `1px solid ${props.theme.Color.Scarlet[500]}` : 'none'};
  display: flex;
  flex-direction: column;
  flex: 1;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;
