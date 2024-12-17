import { useState } from 'react';

import { Icon } from '@wapl/ui';

import EmoticonTab from '@/components/Common/Emoticon/EmoticonTab';
import { EmoticonStore } from '@/stores/EmoticonStore';

import * as S from './Styled';

interface EmoticonTabsProps {
  emoticonStore: EmoticonStore;
}

const EmoticonTabs = (props: EmoticonTabsProps) => {
  const { emoticonStore } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const emoticonPerPage = 7;
  const lastIndex = currentPage * emoticonPerPage;
  const firstIndex = lastIndex - emoticonPerPage;
  const currentEmoticons = emoticonStore.emoticons.slice(firstIndex, lastIndex);

  const lastPage = Math.ceil(emoticonStore.emoticons.length / emoticonPerPage);

  const nextEmoticons = () => {
    setCurrentPage(currentPage === lastPage ? 1 : currentPage + 1);
  };

  const prevEmoticons = () => {
    setCurrentPage(currentPage === 1 ? lastPage : currentPage - 1);
  };
  return (
    <>
      <S.prevEmoticonsButton onClick={prevEmoticons}>
        <Icon.ArrowBackLine width={16} height={16} />
      </S.prevEmoticonsButton>
      <S.EmoticonTabWrapper emoticonPerPage={emoticonPerPage}>
        {currentEmoticons.map((emoticon, index) => (
          <EmoticonTab
            key={`tab-${index}`}
            index={index + emoticonPerPage * (currentPage - 1)}
            emoticonStore={emoticonStore}
            emoticon={emoticon}
          />
        ))}
      </S.EmoticonTabWrapper>
      <S.nextEmoticonsButton onClick={nextEmoticons}>
        <Icon.ArrowFrontLine width={16} height={16} />
      </S.nextEmoticonsButton>
    </>
  );
};

export default EmoticonTabs;
