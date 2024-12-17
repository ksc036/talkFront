import { observer } from 'mobx-react-lite';

import { LinkModel, LinkObjectModel } from '@/models';
import { timeStampFormat } from '@/utils';

import LinkItem from './LinkItem';
import * as S from './styled';

const LinkItems = observer(
  ({ linkObject }: { linkObject: LinkObjectModel }) => {
    return (
      <S.LinkWrapper>
        <S.LinkDate>
          {timeStampFormat(linkObject.date, 'YYYY년 MM월 DD일')}
        </S.LinkDate>

        <S.LinkItemsWrapper>
          {linkObject.links?.map((link: LinkModel) => (
            <LinkItem link={link} />
          ))}
        </S.LinkItemsWrapper>
      </S.LinkWrapper>
    );
  },
);

export default LinkItems;
