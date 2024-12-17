import { CSSProperties, MouseEvent } from 'react';

import { getDefaultImageURL } from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './styled';

interface UserListItemProps {
  personaId: number;
  imgSrc: string;
  isMine: boolean;
  nickName: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const UserListItems = (props: UserListItemProps) => {
  const { personaId, imgSrc, isMine, nickName, style, onClick } = props;
  const { configStore } = useStore();

  const defaultImage = getDefaultImageURL({
    type: 'PROFILE',
    personaId: personaId as number,
  });

  return (
    <S.ItemUserListWrapper key={personaId} onClick={onClick} style={style}>
      <Avatar imgSrc={imgSrc !== '' ? imgSrc : defaultImage} size={36} />
      <S.ItemUserProfile>
        {isMine && (
          <Icon.MeFill width={16} height={16} color={configStore.MefillColor} />
        )}
        <S.ItemUserName>{nickName}</S.ItemUserName>
      </S.ItemUserProfile>
    </S.ItemUserListWrapper>
  );
};

export default UserListItems;
