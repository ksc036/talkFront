import React, { HtmlHTMLAttributes } from 'react';

import { Icon, Mui } from '@wapl/ui';

import * as S from './Styled';

interface CancleButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  width?: number;
  height?: number;
}

const CancelButton = (props: CancleButtonProps) => {
  const { style, icon, onClick, width, height } = props;
  return (
    <S.Wrapper style={{ ...style }}>
      <Mui.IconButton onClick={onClick}>
        {icon || <Icon.CloseLine width={width} height={height} />}
      </Mui.IconButton>
    </S.Wrapper>
  );
};

export default CancelButton;
