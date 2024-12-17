import React, { useEffect, useState } from 'react';

import { Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './styled';

interface PaginationProps {
  totalCount: number;
  countPerPage: number;
  curPage: number;
  setCurPage: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const { totalCount, countPerPage, curPage, setCurPage } = props;

  const { Color } = useTheme();
  const { configStore } = useStore();

  const [pages, setPages] = useState<number[]>([]);

  const handleClickPrev = () => {
    if (curPage - 1 > 0) {
      setCurPage(curPage - 1);
    }
  };

  const handleClickPage = (page: number) => {
    setCurPage(page);
  };

  const handleClickNext = () => {
    if (curPage + 1 <= Math.floor((totalCount - 1) / countPerPage) + 1) {
      setCurPage(curPage + 1);
    }
  };

  const prevButtonDisabled = curPage === 1;
  const nextButtonDisabled =
    curPage === Math.floor((totalCount - 1) / countPerPage) + 1;

  useEffect(() => {
    const totalPage =
      totalCount === 0 ? 0 : Math.floor((totalCount - 1) / countPerPage) + 1;
    let beginPage = 1;
    let endPage = totalPage;

    if (totalPage > 11) {
      if (curPage <= 6) {
        endPage = 11;
      } else if (curPage >= totalPage - 5) {
        beginPage = totalPage - 10;
      } else {
        beginPage = curPage - 5;
        endPage = curPage + 5;
      }
    }

    const pageNums: number[] = [];
    for (let i = beginPage; i <= endPage; i++) {
      pageNums.push(i);
    }
    setPages(pageNums);
  }, [totalCount, countPerPage, curPage]);

  return (
    <S.Wrapper>
      <S.IconWrapper onClick={handleClickPrev} disabled={prevButtonDisabled}>
        <Icon.ArrowBackLine
          width={16}
          height={16}
          color={prevButtonDisabled ? Color.Gray[400] : Color.Gray[900]}
        />
      </S.IconWrapper>
      {pages.map((page) => (
        <S.IconWrapper
          key={page}
          isCurrent={curPage === page}
          onClick={() => handleClickPage(page)}
          color={configStore.PaginationColor}
        >
          {page}
        </S.IconWrapper>
      ))}
      <S.IconWrapper onClick={handleClickNext} disabled={nextButtonDisabled}>
        <Icon.ArrowFrontLine
          width={16}
          height={16}
          color={nextButtonDisabled ? Color.Gray[400] : Color.Gray[900]}
        />
      </S.IconWrapper>
    </S.Wrapper>
  );
};

export default Pagination;
