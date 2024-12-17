import { Icon } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Vote = () => {
  const { uiStore, configStore } = useStore();

  const handleClick = () => {
    uiStore.setVoteDialogMode('allVote');
    uiStore.openDialog('vote');
  };

  return (
    <>
      <TalkFooterItem
        title="투표"
        icon={
          <Icon.VoteLine width={24} height={24} color={configStore.IconColor} />
        }
        onClick={handleClick}
      />
    </>
  );
};

export default Vote;
