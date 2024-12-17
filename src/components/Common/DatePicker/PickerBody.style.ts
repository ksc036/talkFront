import { styled } from '@wapl/ui';

export const YearPickerWrapper = styled.div<{
  size: number;
  backgroundColor: string;
}>`
  // 년도 선택 height 조정
  .MuiYearPicker-root {
    max-height: calc(256px * ${({ size }) => size});
    // 스크롤 안보이게 숨기기
    ::-webkit-scrollbar {
      display: none;
    }
    padding: 0px;
    gap: calc(14px * ${({ size }) => size}) calc(13px * ${({ size }) => size});
  }

  // 년도 칸 크기 조정 및 버튼 컬러 수정
  .PrivatePickersYear-root,
  .PrivatePickersYear-yearButton {
    flex-basis: 0%;
    width: calc(60px * ${({ size }) => size}) !important;
    height: calc(40px * ${({ size }) => size}) !important;
  }
  .PrivatePickersYear-yearButton {
    font-size: 12px;
    font-weight: 700;
    margin: 0px;
    &,
    &.Mui-selected {
      color: #000000;
      background-color: ${({ backgroundColor }) => backgroundColor};
      :hover,
      :active,
      :focus {
        background-color: ${({ backgroundColor }) => backgroundColor};
      }
    }
  }
`;

export const MonthPickerWrapper = styled.div<{
  size: number;
  backgroundColor: string;
}>`
  // 월 선택 width 조정
  .MuiMonthPicker-root {
    width: calc(280px * ${({ size }) => size});
    margin: 0px 0px 4px 0px;
    gap: calc(36px * ${({ size }) => size}) calc(13px * ${({ size }) => size});
  }

  // 월 선택 칸 크기 조정
  .PrivatePickersMonth-root {
    width: calc(60px * ${({ size }) => size}) !important;
    height: calc(60px * ${({ size }) => size}) !important;
    font-size: 12px;
    font-weight: 700;
    margin: 0px;
    flex: none;
    &,
    &.Mui-selected {
      color: #000000;
      background-color: ${({ backgroundColor }) => backgroundColor};
      :hover,
      :active,
      :focus {
        background-color: ${({ backgroundColor }) => backgroundColor};
      }
    }
  }
`;
