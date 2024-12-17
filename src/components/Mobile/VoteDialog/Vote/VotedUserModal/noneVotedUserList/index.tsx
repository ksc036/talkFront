import { RoomMember } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from './Styled';

interface NoneVotedUserListProps {
  noneVotedUserList: RoomMember[];
}

const NoneVotedUserList = observer((props: NoneVotedUserListProps) => {
  const { noneVotedUserList } = props;
  return (
    <S.ItemWrapper>
      {noneVotedUserList.length > 0 ? (
        noneVotedUserList.map((persona) => {
          return (
            <S.ItemUserListWrapper key={persona.personaId}>
              <Avatar imgSrc={persona.profileImageFilepath ?? ''} />
              <S.ItemUserProfile>
                <S.ItemUserName>{persona.personaNick}</S.ItemUserName>
              </S.ItemUserProfile>
            </S.ItemUserListWrapper>
          );
        })
      ) : (
        <S.NoUser>미참여자가 없습니다.</S.NoUser>
      )}
    </S.ItemWrapper>
  );
});

export default NoneVotedUserList;
