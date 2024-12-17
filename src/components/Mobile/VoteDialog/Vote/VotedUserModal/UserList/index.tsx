import { useState, useEffect } from 'react';

import { PersonaModel, useCoreStore } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { VoteItemModel } from '@/models/VoteModel';
import { useStore } from '@/stores';

import * as S from './Styled';

interface UserListProps {
  voteItem: VoteItemModel;
}

const UserList = observer((props: UserListProps) => {
  const { configStore } = useStore();
  const { personaStore } = useCoreStore();
  const { voteItem } = props;
  const votedUserNum = voteItem.personaIds.length;
  const [personas, setPersonas] = useState<Array<PersonaModel | null>>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const fetchedPersonas = [];
      for (const personaId of voteItem.personaIds) {
        const persona = personaStore.getPersona(personaId) as PersonaModel;
        if (!persona) {
          await personaStore.fetchPersona({
            personaId: personaId,
          });
          const fetchedPersona = personaStore.getPersona(personaId) ?? null;

          fetchedPersonas.push(fetchedPersona);
        } else {
          fetchedPersonas.push(persona);
        }
      }
      setPersonas(fetchedPersonas);
    };

    fetchPersonas();
  }, [voteItem, personaStore]);

  return (
    <S.ItemWrapper>
      <S.ItemTitleWrapper>
        <S.ItemTitle color={configStore.config.MainColor}>
          {voteItem.itemContent} <span>{votedUserNum}</span>
        </S.ItemTitle>
      </S.ItemTitleWrapper>
      {votedUserNum > 0 ? (
        personas.map((persona) => {
          if (persona)
            return (
              <S.ItemUserListWrapper key={persona.id}>
                <Avatar imgSrc={persona?.profileImage} />
                <S.ItemUserProfile>
                  <S.ItemUserName>{persona.nick}</S.ItemUserName>
                </S.ItemUserProfile>
              </S.ItemUserListWrapper>
            );
        })
      ) : (
        <S.NoUser>투표한 사람이 없습니다.</S.NoUser>
      )}
    </S.ItemWrapper>
  );
});

export default UserList;
