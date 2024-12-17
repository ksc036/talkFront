import { Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Icon, SearchField } from '@wapl/ui';
import { observer } from 'mobx-react';

import * as S from './style';

interface HeaderProps {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}
const Header = observer((props: HeaderProps) => {
  const { keyword, setKeyword } = props;
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.includes('search/room'))
    return (
      <S.HeaderContainer>
        <SearchField
          width={'calc(100% - 42px)'}
          variant={'filled'}
          value={keyword}
          onClear={() => {
            setKeyword('');
          }}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="룸 이름 검색"
          FixedSuffix={true}
          sx={{
            '& .MuiInputBase-root.Mui-focused::after': { border: '#fff' },
            '& .MuiFilledInput-root:hover': { backgroundColor: '#fff ' },
            '& .MuiFilledInput-root.Mui-focused': {
              backgroundColor: '#F1F3F4',
            },
          }}
        />
        <S.SearchButton
          onClick={() => {
            navigate(-1);
            setKeyword('');
          }}
        >
          취소
        </S.SearchButton>
      </S.HeaderContainer>
    );
  else
    return (
      <S.HeaderContainer>
        <S.HeaderSection>
          <S.HeaderMenuTitle>톡</S.HeaderMenuTitle>
        </S.HeaderSection>
        <S.HeaderSection>
          <S.IconWrapper onClick={() => navigate('./search/room')}>
            <Icon.SearchLine />
          </S.IconWrapper>
        </S.HeaderSection>
      </S.HeaderContainer>
    );
});

export default Header;
